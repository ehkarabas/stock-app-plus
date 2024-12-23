"use strict";

// Middleware: permissions

const getUser = (req) => (req.userAPI ? req.userAPI : req.userBrowser);

module.exports = {
  isLogin: (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (user?.isActive) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },

  isAdmin: (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (process.env?.ONLY_LOGIN === "true") {
      if (user?.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login.");
      }
    } else {
      // only Admin:
      if (user?.isActive && user?.isAdmin) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login and to be Admin.");
      }
    }
  },

  isStaff: (req, res, next) => {
    // Set Passive:
    if (process.env?.NO_PERMISSION === "true") return next();

    const user = getUser(req);

    if (process.env?.ONLY_LOGIN === "true") {
      if (user?.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login.");
      }
    } else {
      // only Admin or Staff:
      if (user?.isActive && (user.isAdmin || user.isStaff)) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login and to be Staff.");
      }
    }
  },
  getUser,
};
