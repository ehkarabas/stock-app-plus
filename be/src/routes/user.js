"use strict";

const user = require("../controllers/user");
const router = require("express").Router();
const { isLogin, isStaff, isAdmin } = require("../middlewares/permissions");
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------------- */
// routes/user:

// URL: /users

// router.route('/(:id)?') // id optional

router
  .route("/:userId")
  .all(idValidation)
  // ? get single
  .get(isLogin, user.read)
  // ? update
  .put(isLogin, user.update)
  .patch(isLogin, user.update)
  // ? delete
  .delete(isAdmin, user.destroy);

router
  .route("/")
  // ? get all
  // ? user.list icinde isAdmin kontrolu zaten yapiliyor
  .get(isLogin, user.list)
  // ? create
  .post(user.create); // AllowAny

/* ------------------------------------------------------- */
module.exports = router;
