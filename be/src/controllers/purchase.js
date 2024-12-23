"use strict";

// Purchase Controller:
const Purchase = require("../models/purchase");
const Product = require("../models/product");
const { getUser } = require("../middlewares/permissions");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Purchases"]
      #swagger.summary = "List Purchases <Permissions: Staff>"
      #swagger.description = `
        You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
        <ul> Examples:
            <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
            <li>URL/?<b>limit=10&page=1</b></li>
        </ul>
      `
    */

    const data = await res.getModelList(Purchase, {}, [
      { path: "userId", select: "username email" },
      { path: "firmId", select: "name image" },
      { path: "brandId", select: "name image" },
      {
        path: "productId",
        select: "name quantity",
        populate: { path: "categoryId", select: "name" },
      },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Purchase),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Purchases"]
      #swagger.summary = "Create Purchase <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f001",
          firmId: "65343222b67e9681f937f304",
          brandId: "65343222b67e9681f937f123",
          productId: "65343222b67e9681f937f422",
          quantity: 10,
          price: 20,
        }
      }
    */

    // userId verisini req.user'dan al
    const user = getUser(req);
    req.body.userId = user._id;

    const data = await Purchase.create(req.body);

    // product quantity'i req.body'deki quantity kadar artir, stok guncellensin
    await Product.findOneAndUpdate(
      { _id: req.body.productId },
      { $inc: { quantity: +data.quantity } },
      { new: true, runValidators: true }
    );
    // typeof +"5" -> Number

    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Purchases"]
      #swagger.summary = "Get Single Purchase <Permissions: Staff>"
    */
    const data = await Purchase.findOne({
      _id: req.params.purchaseId,
    }).populate([
      { path: "userId", select: "username email" },
      { path: "firmId", select: "name image" },
      { path: "brandId", select: "name image" },
      {
        path: "productId",
        select: "name quantity",
        populate: { path: "categoryId", select: "name" },
      },
    ]);
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Purchases"]
      #swagger.summary = "Update Purchase <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f001",
          firmId: "65343222b67e9681f937f304",
          brandId: "65343222b67e9681f937f123",
          productId: "65343222b67e9681f937f422",
          quantity: 15,
          price: 25,
        }
      }
    */
    // req.body'de quantity varsa product quantity'i guncelle, stok guncellensin
    if (req.body?.quantity) {
      // mevcut purchase quantity'i al
      const currentPurchase = await Purchase.findOne({
        _id: req.params.purchaseId,
      });
      // farki bul
      const difference = req.body.quantity - currentPurchase.quantity;
      // typeof "5" - "3" -> Number
      // farki product'a kaydet
      await Product.findOneAndUpdate(
        { _id: currentPurchase.productId },
        { $inc: { quantity: +difference } },
        { new: true, runValidators: true }
      );
    }

    const data = await Purchase.findOneAndUpdate(
      { _id: req.params.purchaseId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(202).send({
      error: false,
      body: req.body,
      new: data,
    });
  },
  destroy: async (req, res) => {
    /*
      #swagger.tags = ["Purchases"]
      #swagger.summary = "Delete Purchase <Permissions: Admin>"
    */
    // mevcut purchase quantity'i al
    const currentPurchase = await Purchase.findOne({
      _id: req.params.purchaseId,
    });

    const data = await Purchase.deleteOne({ _id: req.params.purchaseId });

    // quantity'i product quantity'den cikar, stok guncellensin
    await Product.findOneAndUpdate(
      { _id: currentPurchase.productId },
      { $inc: { quantity: -currentPurchase.quantity } },
      { new: true, runValidators: true }
    );
    // typeof -"5" -> Number

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
