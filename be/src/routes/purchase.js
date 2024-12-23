"use strict";

const purchase = require("../controllers/purchase");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/purchase:

// URL: /purchases

// router.route('/(:id)?') // id optional

router
  .route("/:purchaseId")
  .all(idValidation)
  // ? get single
  .get(isStaff, purchase.read)
  // ? update
  .put(isAdmin, purchase.update)
  .patch(isAdmin, purchase.update)
  // ? delete
  .delete(isAdmin, purchase.destroy);

router
  .route("/")
  // ? get all
  .get(isStaff, purchase.list)
  // ? create
  .post(isAdmin, purchase.create);
/* ------------------------------------------------------- */
module.exports = router;
