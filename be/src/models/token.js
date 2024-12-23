"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const emailFieldValidator = require("../helpers/emailFieldValidator");
const {
  dateFieldTimeOffset,
  timeStampsOffset,
} = require("../helpers/modelDateTimeOffset");
/* ------------------------------------------------------- */

const TokenSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
  },
  {
    collection: "token",
    timestamps: { currentTime: timeStampsOffset },
  }
);

/* ------------------------------------------------------- */

module.exports = models?.Token || model("Token", TokenSchema);
