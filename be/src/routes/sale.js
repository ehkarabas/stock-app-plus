"use strict";

const sale = require("../controllers/sale");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/sale:

// URL: /sales

// router.route('/(:id)?') // id optional

router
  .route("/:saleId")
  .all(idValidation)
  // ? get single
  .get(isStaff, sale.read)
  // ? update
  .put(isAdmin, sale.update)
  .patch(isAdmin, sale.update)
  // ? delete
  .delete(isAdmin, sale.destroy);

router
  .route("/")
  // ? get all
  .get(isStaff, sale.list)
  // ? create
  .post(isAdmin, sale.create);
/* ------------------------------------------------------- */
module.exports = router;
