"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;
const { timeStampsOffset } = require("../helpers/modelDateTimeOffset");
const Product = require("./product");
/* ------------------------------------------------------- */

const SaleSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    collection: "sale",
    timestamps: { currentTime: timeStampsOffset },
  }
);

// pre('init') -> ekrana veriyi vermeden once manipule etmeyi saglar, find query'leriyle calisir.
// pre('init') populate'ten once calisir
// pre('init') middleware degildir, next'e gerek yoktur.
// SaleSchema.pre("init", function (doc) {
//   console.log(doc);
//   doc.extraField = "CoolDev";
//   doc.createdAtStr = doc.createdAt.toLocaleString("tr-tr", {
//     dateStyle: "full",
//     timeStyle: "medium",
//   });
//   doc.updatedAtStr = doc.updatedAt.toLocaleString("tr-tr", {
//     dateStyle: "full",
//     timeStyle: "medium",
//   });
//   doc.createdAt = undefined;
//   doc.updatedAt = undefined;
//   // field type'larin tutmasi gerekir, tutmazsa field result set'ten atilir.
//   // doc.price = 600;
//   doc.__v = undefined;
// });

// pre middleware callback'indeki arguman'in neyi ifade ettigi event'lara gore degisir.
// pre init ve pre validate'te pre callback'inde tek arguman kullanilir ve bu doc'tur, yani this'tir.
// pre save/remove'da async bir islem yoksa(callback'in async olmasi degil, body'de async herhangi bir islem olmasi kastediliyor) next'e gerek yoktur, cunku tum body zaten sync calisir. next async islemlerin tamamlanmasinin ardindan sonraki middleware'e aktarmak icin kullanilir.
// post save/remove'da ise tek arguman kullanilirsa pre init ve pre validate'te oldugu gibi bu doc olur. post middleware'lerinde genellikle next kullanılmasına gerek yoktur, çünkü işlem zaten tamamlanmış olur. Eğer post middleware'ine async bir fonksiyon tek bir parametre (doc) ile tanımlanırsa, Mongoose bu fonksiyonun sonuçlanmasını (yani Promise'in çözümlenmesini) bekler. Bu durumda, işlem tamamlandığında otomatik olarak bir sonraki adıma geçilir ve next() fonksiyonunu çağırmanıza gerek kalmaz. Ancak async fonksiyon iki parametre (doc, next) alıyorsa, bu durumda fonksiyonun sonunda next() fonksiyonunu manuel olarak çağırmanız gerekir. Bu, Mongoose'a middleware işleminin tamamlandığını ve zincirin bir sonraki halkasına geçilebileceğini bildirir.

/* ------------------------------------------------------- */

module.exports = models?.Sale || model("Sale", SaleSchema);

// * update icin productId mevcut olmayabileceginden bu req.params ile sale id cekilip sale document'i uzerinden productId'ye erisim saglamayi gerektirecektir. bu nedenle pre save-findOneAndUpdate middleware'i bu ornek icin calismaz, controller'da islem gerceklestirilmelidir.
// SaleSchema.pre(
//   ["save", "updateOne", "findOneAndUpdate"],
//   async function (next) {
//     // get data from "this" or "this._update"
//     const data = this?._update || this;
//     console.log("🔭 ~ data ➡ ➡ ", data);
//     // update override icin:
//     // this._update.fieldName = data.fieldName;

//     const product = await Product.findById(data.productId);
//     let quantityChange = 0;

//     // if (!this?._update) {
//     if (this instanceof mongoose.Query && data?.quantity) {
//       // Sale document guncellenirse ve body'de quantity varsa, eski ve yeni miktar arasındaki farki hesapla
//       const oldDoc = await Sale.findById(data._id);
//       quantityChange = oldDoc.quantity - data.quantity;

//       // Guncelleme durumunda stok negatife dusuyorsa hata firlat
//       if (product.quantity + quantityChange < 0) {
//         throw new Error("Insufficient stock.");
//       } else {
//         product.quantity += quantityChange;
//       }
//     } else {
//       // if (this.isNew) {
//       // Yeni bir satış işlemi yapıldığında, eğer yeterli stok varsa azalt
//       if (product.quantity >= data.quantity) {
//         product.quantity -= data.quantity;
//       } else {
//         // Yeterli stok yoksa işlemi iptal et ve hata fırlat
//         throw new Error("Insufficient stock.");
//       }
//     }

//     await product.save();
//     next();
//   }
// );

// pre middleware'lerinde mevcut modele erişilebilir, çünkü Mongoose, model() fonksiyonunu çağırdığınızda modeli derhal oluşturur ve kayıtlar. Bu modelin tanımı oluşturulduktan sonra, model metotları ve middleware'ler içinde kullanılabilir hale gelir. module.exports satırı modülün dışa aktarımını tanımlar ve bu kodun yukarıdaki kısmında zaten model tanımlandığı için, middleware'ler bu modeli doğrudan referans alabilir.

// * updateOne gibi metotlarda this._update üzerinden güncelleme yapılan belgeye erişim mümkünken, deleteOne işlemlerinde benzer bir erişim yoktur.
// SaleSchema.pre("deleteOne", async function (next) {
//   console.log("🔭 ~ sale pre deleteOne this ➡ ➡ ", this);
//   // const product = await Product.findById(this.productId);
//   // // Satış işlemi silindiğinde, satılan ürün miktarını stok'a geri ekle
//   // product.quantity += this.quantity;
//   // await product.save();
//   next();
// });
