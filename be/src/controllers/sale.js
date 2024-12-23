"use strict";

// Sale Controller:
const Sale = require("../models/sale");
const Product = require("../models/product");
const { getUser } = require("../middlewares/permissions");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Sales"]
      #swagger.summary = "List Sales <Permissions: Staff>"
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

    const data = await res.getModelList(Sale, {}, [
      { path: "userId", select: "username email" },
      { path: "brandId", select: "name image" },
      {
        path: "productId",
        select: "name quantity",
        populate: { path: "categoryId", select: "name" },
      },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Sale),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Sales"]
      #swagger.summary = "Create Sale <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f001",
          brandId: "65343222b67e9681f937f123",
          productId: "65343222b67e9681f937f422",
          quantity: 10,
          price: 30,
        }
      }
    */
    // userId verisini req.user'dan al
    const user = getUser(req);
    req.body.userId = user._id;

    // Guncel product bilgisini al
    const currentProduct = await Product.findOne({ _id: req.body.productId });
    if (currentProduct.quantity >= req.body.quantity) {
      const data = await Sale.create(req.body);

      // product quantity'i req.body'deki quantity kadar eksilt, stok guncellensin
      await Product.findOneAndUpdate(
        { _id: req.body.productId },
        { $inc: { quantity: -+data.quantity } },
        { new: true, runValidators: true }
      );
      // typeof -+"5" -> Number

      res.status(201).send({
        error: false,
        result: data,
      });
    } else {
      res.errorStatusCode = 422;
      throw new Error("There is not enough product quantity for this sale.", {
        cause: currentProduct,
      });
    }
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Sales"]
      #swagger.summary = "Get Single Sale <Permissions: Staff>"
    */
    const data = await Sale.findOne({ _id: req.params.saleId }).populate([
      { path: "userId", select: "username email" },
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
      #swagger.tags = ["Sales"]
      #swagger.summary = "Update Sale <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: schema: {
          userId: "65343222b67e9681f937f001",
          brandId: "65343222b67e9681f937f123",
          productId: "65343222b67e9681f937f422",
          quantity: 15,
          price: 35,
        }
      }
    */

    // req.body'de quantity varsa product quantity'i guncelle, stok guncellensin
    if (req.body?.quantity) {
      // mevcut purchase quantity'i al
      const currentSale = await Sale.findOne({
        _id: req.params.saleId,
      }).populate({ path: "productId", select: "quantity" });
      // farki bul
      const difference = +req.body.quantity - currentSale.quantity;
      // typeof +"5" -> Number, 5-"3" = 2
      // farki product'a kaydet
      const updateProduct = await Product.updateOne(
        { _id: currentSale.productId._id, quantity: { $gte: difference } },
        { $inc: { quantity: -difference } },
        { runValidators: true }
      );
      // typeof "-5" -> Number
      // update islemi olmamissa hata firlat
      if (updateProduct.modifiedCount == 0) {
        res.errorStatusCode = 422;
        throw new Error("There is not enough product quantity for this sale.", {
          cause: {
            desiredSale: req.body.quantity,
            productStock: currentSale.productId.quantity + currentSale.quantity,
          },
        });
      }
    }

    const data = await Sale.findOneAndUpdate(
      { _id: req.params.saleId },
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
      #swagger.tags = ["Sales"]
      #swagger.summary = "Delete Sale <Permissions: Admin>"
    */
    // Product quantity sale model pre remove middleware'inde handle ediliyor
    // mevcut purchase quantity'i al
    const currentSale = await Sale.findOne({
      _id: req.params.saleId,
    });

    const data = await Sale.deleteOne({ _id: req.params.saleId });

    // quantity'i product quantity'e ekle, stok guncellensin
    await Product.findOneAndUpdate(
      { _id: currentSale.productId },
      { $inc: { quantity: +currentSale.quantity } },
      { new: true, runValidators: true }
    );
    // typeof +"5" -> Number

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
