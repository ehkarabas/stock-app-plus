"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const { getUser } = require("../middlewares/permissions");
const loginCredentialsGenerator = require("../helpers/loginCredentialsGenerator");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "List Users <Permissions: AdminOrOwn>"
      #swagger.description = `
        You can send query with endpoint for filter[], search[], sort[], page and limit.
        <ul> Examples:
          <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
          <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
          <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
          <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
      `
    */

    const user = getUser(req);

    const filters = user.isAdmin ? {} : { _id: user._id };

    const data = await res.getModelList(User, filters);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User, filters),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Create User <Permissions: Public>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "username": "test",
            "password": "Qwer1234!",
            "email": "test@site.com",
            "firstName": "test",
            "lastName": "test",
        }
      }
    */

    // Yeni kayitlarda admin, active ve staff false override
    delete req.body.isActive;
    req.body.isStaff = false;
    req.body.isAdmin = false;

    const data = await User.create(req.body);

    /* AUTO LOGIN(TOKEN & JWT & COOKIE) */
    const { tokenData, accessToken, refreshToken } =
      await loginCredentialsGenerator(data, req);
    /* AUTO LOGIN(TOKEN & JWT & COOKIE) */

    res.status(201).send({
      error: false,
      token: tokenData?.token,
      bearer: {
        access: accessToken,
        refresh: refreshToken,
      },
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Get Single User <Permissions: Login>"
    */
    const user = getUser(req);

    // Admin degilse sadece kendi kaydini gorebilir
    const filters = user.isAdmin
      ? { _id: req.params.userId }
      : { _id: user._id };

    const data = await User.findOne(filters);

    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User <Permissions: Login>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "username": "testedit",
            "password": "Qwer4321!",
            "email": "testedit@site.com",
            "firstName": "testedit",
            "lastName": "testedit",
        }
      }
    */
    const user = getUser(req);

    // isAdmin hicbir sekilde degistirilemez(admin 1 tane olur)
    delete req.body.isAdmin;

    // Admin degilse kullanici yetkilerini degistiremez
    if (!user.isAdmin) {
      delete req.body.isStaff;
      delete req.body.isActive;
    }

    // Admin degilse sadece kendi kaydini guncelleyebilir
    const filters = user.isAdmin
      ? { _id: req.params.userId }
      : { _id: user._id };
    // const filters = { _id: req.params.userId };

    const data = await User.findOneAndUpdate(filters, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      body: req.body,
      new: data,
    });
  },
  destroy: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Delete User <Permissions: Admin>"
    */
    const user = getUser(req);
    // Sadece kendi kaydını silebilir:
    // Permission'da isAdmin kontrolu yapildigi icin burada ihtiyac yok
    // const customFilters = user?.isAdmin ? { _id: req.params.id } : {}

    // admin kendini silemez
    if (req.params.id != user._id) {
      const data = await User.deleteOne({ _id: req.params.id });

      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        result: data,
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error("Admin account can not be removed.");
    }
  },
};
