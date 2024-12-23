"use strict";

// Brand Controller:
const Brand = require("../models/brand");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Brands"]
      #swagger.summary = "List Brands <Permissions: Public>"
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

    const data = await res.getModelList(Brand);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Brand),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Brands"]
      #swagger.summary = "Create Brand <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "Brand1",
            "image": "https://logos.flamingtext.com/Word-Logos/product-design-sketch-name.png"
        }
      }
    */
    const data = await Brand.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Brands"]
      #swagger.summary = "Get Single Brand <Permissions: Public>"
    */
    const data = await Brand.findOne({ _id: req.params.brandId });
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Brands"]
      #swagger.summary = "Update Brand <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "BrandUP",
            "image": "https://logos.flamingtext.com/Word-Logos/product-design-sketch-name.png"
        }
      }
    */
    const data = await Brand.findOneAndUpdate(
      { _id: req.params.brandId },
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
      #swagger.tags = ["Brands"]
      #swagger.summary = "Delete Brand <Permissions: Admin>"
    */
    const data = await Brand.deleteOne({ _id: req.params.brandId });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
