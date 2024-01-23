const express = require("express");
const router = express.Router();
const AuthController = require("../controllers");
const AuthModel = require("../model/index");
const { body } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../middlewares/guard");
const { models } = require("mongoose");

router.post(
  "/signup",
  body(["username", "password", "fullName", "userType", "company", "branch"])
    .optional()
    .isString(),

  validator,
  AuthController.signup
);

router.post(
  "/signup-verify",
  body(["userId", "code"]).exists().isString(),
  validator,
  AuthController.signupVerify
);

router.post(
  "/login",
  body(["username", "password"]).exists().isString(),
  validator,
  AuthController.login
);

router.get(
  "/permission",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
      AuthModel.TYPE_EXIT,
    ],
  }),
  validator,
  AuthController.permission
);

module.exports = router;
