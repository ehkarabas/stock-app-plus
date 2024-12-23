"use strict";

const brand = require("../controllers/brand");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/brand:

// URL: /brands

// router.route('/(:id)?') // id optional

router
  .route("/:brandId")
  .all(idValidation)
  // ? get single
  .get(brand.read) // AllowAny
  // ? update
  .put(isAdmin, brand.update)
  .patch(isAdmin, brand.update)
  // ? delete
  .delete(isAdmin, brand.destroy);

router
  .route("/")
  // ? get all
  .get(brand.list) // AllowAny
  // ? create
  .post(isAdmin, brand.create);
/* ------------------------------------------------------- */
module.exports = router;
