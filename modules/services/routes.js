const express = require("express");
const router = express.Router();
const { body, query, param } = require("express-validator");
const routeGuard = require("../auth/middlewares/guard");
const { validator } = require("../middlewares");
const ServiceServices = require("./service");
const AuthModel = require("../auth/model/index");
router.post(
  "/syncInvoices",
  ServiceServices.syncInvoices
);

// router.post(
//   "/getOutsideInvoices",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_SUPERADMIN, AuthModel.TYPE_ADMIN],
//   }),
//   validator,
//   ServiceServices.getOutsideInvoices
// );

module.exports = router;
