"use strict";

// Firm Controller:
const Firm = require("../models/firm");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Firms"]
      #swagger.summary = "List Firms <Permissions: Public>"
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

    const data = await res.getModelList(Firm);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Firm),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Firms"]
      #swagger.summary = "Create Firm <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          name: "Firm1",
          phone: "0123 456 78 90",
          image: "https://i.hizliresim.com/njdfesd.png",
          address: "Turkey",
        }
      }
    */

    const data = await Firm.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Firms"]
      #swagger.summary = "Get Single Firm <Permissions: Public>"
    */
    const data = await Firm.findOne({ _id: req.params.firmId });
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Firms"]
      #swagger.summary = "Update Firm <Permissions: Admin>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          name: "FirmUP",
          phone: "0123 456 78 90",
          image: "https://i.hizliresim.com/njdfesd.png",
          address: "Turkey",
        }
      }
    */
    const data = await Firm.findOneAndUpdate(
      { _id: req.params.firmId },
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
      #swagger.tags = ["Firms"]
      #swagger.summary = "Delete Firm <Permissions: Admin>"
    */
    const data = await Firm.deleteOne({ _id: req.params.firmId });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
