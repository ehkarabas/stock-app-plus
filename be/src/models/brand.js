"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const BrandSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "brand",
    timestamps: { currentTime: timeStampsOffset },
  }
);

module.exports = models?.Brand || model("Brand", BrandSchema);
