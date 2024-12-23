"use strict";

const product = require("../controllers/product");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/product:

// URL: /products

// router.route('/(:id)?') // id optional

router
  .route("/:productId")
  .all(idValidation)
  // ? get single
  .get(product.read) // AllowAny
  // ? update
  .put(isAdmin, product.update)
  .patch(isAdmin, product.update)
  // ? delete
  .delete(isAdmin, product.destroy);

router
  .route("/")
  // ? get all
  .get(product.list) // AllowAny
  // ? create
  .post(isAdmin, product.create);
/* ------------------------------------------------------- */
module.exports = router;
