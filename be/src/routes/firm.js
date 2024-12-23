"use strict";

const firm = require("../controllers/firm");
const idValidation = require("../middlewares/idValidation");
const router = require("express").Router();
const { isAdmin, isStaff } = require("../middlewares/permissions");
/* ------------------------------------------------------- */
// routes/firm:

// URL: /firms

// router.route('/(:id)?') // id optional

router
  .route("/:firmId")
  .all(idValidation)
  // ? get single
  .get(firm.read) // AllowAny
  // ? update
  .put(isAdmin, firm.update)
  .patch(isAdmin, firm.update)
  // ? delete
  .delete(isAdmin, firm.destroy);

router
  .route("/")
  // ? get all
  .get(firm.list) // AllowAny
  // ? create
  .post(isAdmin, firm.create);
/* ------------------------------------------------------- */
module.exports = router;
