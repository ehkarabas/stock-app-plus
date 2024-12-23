"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const { timeStampsOffset } = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const ProductSchema = Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      set: (input) =>
        input
          .split(" ") // Metni bosluklara gore ayir
          .map((name) => name[0].toUpperCase() + name.slice(1)) // Her kelimenin ilk harfini buyuk yap
          .join(" "), // Kelimeleri boslukla birlestir,
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "product",
    timestamps: { currentTime: timeStampsOffset },
  }
);

/* ------------------------------------------------------- */

module.exports = models?.Product || model("Product", ProductSchema);
