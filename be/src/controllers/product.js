"use strict";

// Product Controller:
const Product = require("../models/product");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Products"]
      #swagger.summary = "List Products <Permissions: Public>"
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

    const data = await res.getModelList(Product, {}, [
      { path: "categoryId", select: "name" },
      { path: "brandId", select: "name image" },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Product),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Products"]
      #swagger.summary = "Create Product <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          name: "Product1",
          categoryId: "65343222b67e9681f937f203",
          brandId: "65343222b67e9681f937f107",
          quantity: 0,
          price: 100,
        }
      }
    */
    const data = await Product.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Products"]
      #swagger.summary = "Get Single Product <Permissions: Public>"
    */
    const data = await Product.findOne({ _id: req.params.productId }).populate([
      { path: "categoryId", select: "name" },
      { path: "brandId", select: "name image" },
    ]);
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Products"]
      #swagger.summary = "Update Product <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          name: "ProductUP",
          categoryId: "65343222b67e9681f937f203",
          brandId: "65343222b67e9681f937f107",
          quantity: 1,
          price: 101,
        }
      }
    */
    const data = await Product.findOneAndUpdate(
      { _id: req.params.productId },
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
      #swagger.tags = ["Products"]
      #swagger.summary = "Delete Product <Permissions: Admin>"
    */
    const data = await Product.deleteOne({ _id: req.params.productId });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
