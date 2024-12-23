"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const { timeStampsOffset } = require("../helpers/modelDateTimeOffset");
const Product = require("./product");
/* ------------------------------------------------------- */

const PurchaseSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    firmId: {
      type: Schema.Types.ObjectId,
      ref: "Firm",
      required: true,
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    priceTotal: {
      type: Number,
      required: true,
      default: function () {
        return this.quantity * this.price;
      }, // body'de deger gonderilmedigi zaman calisir
      set: function () {
        return this.quantity * this.price;
      }, // body'de deger gonderildigi zaman calisir
    },
  },
  {
    collection: "purchase",
    timestamps: { currentTime: timeStampsOffset },
  }
);

/* ------------------------------------------------------- */

module.exports = models?.Purchase || model("Purchase", PurchaseSchema);

// * update icin productId mevcut olmayabileceginden bu req.params ile sale id cekilip sale document'i uzerinden productId'ye erisim saglamayi gerektirecektir. bu nedenle pre save-findOneAndUpdate middleware'i bu ornek icin calismaz, controller'da islem gerceklestirilmelidir.
// PurchaseSchema.pre(
//   ["save", "updateOne", "findOneAndUpdate"],
//   async function (next) {
//     // get data from "this" or "this._update"
//     const data = this?._update || this;
//     console.log("🔭 ~ data ➡ ➡ ", data);
//     // update override icin:
//     // this._update.fieldName = data.fieldName;

//     const product = await Product.findById(data.productId);
//     // if (!this?._update) {
//     if (this instanceof mongoose.Query && data?.quantity) {
//       // purchase document guncellenirse, miktar farkini hesapla ve guncelle
//       const oldDoc = await Purchase.findById(data._id);
//       const quantityChange = data.quantity - oldDoc.quantity;
//       product.quantity += quantityChange;
//     } else {
//       // yeni bir satın alma islemi yapildiginda urun miktarini artir
//       product.quantity += data.quantity;
//     }
//     await product.save();
//     next();
//   }
// );

// * updateOne gibi metotlarda this._update üzerinden güncelleme yapılan belgeye erişim mümkünken, deleteOne işlemlerinde benzer bir erişim yoktur.
// PurchaseSchema.pre("deleteOne", async function (next) {
//   console.log("🔭 ~ purchase pre deleteOne this ➡ ➡ ", this);
//   // const product = await Product.findById(this.productId);
//   // // purchase document silinirken, stok miktari silinen miktardan az ise hata firlat
//   // if (product.quantity < this.quantity) {
//   //   throw new Error(
//   //     "The stock quantity is so low that it becomes negative. The transaction has been cancelled."
//   //   );
//   // } else {
//   //   // Yeterli stok varsa, satin alinan miktari stoktan dus
//   //   product.quantity -= this.quantity;
//   //   await product.save();
//   // }
//   next();
// });
