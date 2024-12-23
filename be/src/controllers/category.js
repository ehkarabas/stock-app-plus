"use strict";

// Category Controller:
const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Categories"]
      #swagger.summary = "List Categories <Permissions: Public>"
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

    const data = await res.getModelList(Category);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Category),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Categories"]
      #swagger.summary = "Create Category <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "Category1"
        }
      }
    */
    const data = await Category.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Categories"]
      #swagger.summary = "Get Single Category <Permissions: Public>"
    */
    const data = await Category.findOne({ _id: req.params.categoryId });
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Categories"]
      #swagger.summary = "Update Category <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "CategoryUP"
        }
      }
    */
    const data = await Category.findOneAndUpdate(
      { _id: req.params.categoryId },
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
      #swagger.tags = ["Categories"]
      #swagger.summary = "Delete Category <Permissions: Admin>"
    */
    const data = await Category.deleteOne({ _id: req.params.categoryId });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
