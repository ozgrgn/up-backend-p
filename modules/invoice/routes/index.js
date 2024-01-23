const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers");
const AuthModel = require("../../auth/model/index");
const { body, query, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");

router.post(
  "/",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  body([
    "invoiceDate",
    "company",
    "branch",
    "campaign",
    "shopman",
    "destCountry",
    "destCity",
    "way",
    "airport",
    "terminal",
    "deparDate",
    "deparTime",
    "invoiceSerial",
    "invoiceNo",
    "airline",
    "flight",
    "agency",
    "guide",
    "note",
    "agencyId",
    "campaignId",
    "airlineId",
    "terminalId",
  ])
    .optional()
    .isString(),
  body(["client", "details"]).optional(),
  validator,
  InvoiceController.addInvoice
);

router.get(
  "/",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  query(["invoiceNo", "fullName", "sort", "status", "company", "terminal"])
    .optional()
    .isString(),
  query(["limit", "skip"]).optional().toInt().isInt(),
  query([
    "approved",
    "invoiceDate1",
    "invoiceDate2",
    "deparDate1",
    "deparDate2",
  ]).optional(),
  validator,
  InvoiceController.getInvoices
);

router.get(
  "/one/:invoiceId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  param("invoiceId").exists().isMongoId(),
  validator,
  InvoiceController.getInvoiceWithId
);

router.put(
  "/:invoiceId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  param("invoiceId").exists().isMongoId(),
  body(["invoice"]).exists(),
  validator,
  InvoiceController.updateInvoiceWithById
);

router.post(
  "/approved/:invoiceId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  param("invoiceId").exists().isMongoId(),
  body(["status", "reasonId", "declineDate", "approveDate", "approveNo"])
    .exists()
    .optional(),

  validator,
  InvoiceController.changeApproveStatus
);

router.delete(
  "/:id",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  param("id").exists().isMongoId(),
  validator,
  InvoiceController.deleteInvoice
);

router.get(
  "/performance",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  query([
    "company",
    "branch",
    "sort",
    "status",
    "invoiceDate1",
    "invoiceDate2",
    "approveDate1",
    "approveDate2",
    "deparDate1",
    "deparDate2",
  ])
    .optional()
    .isString(),

  query(["noPending"]).optional(),
  validator,
  InvoiceController.getPerformance
);
router.get(
  "/productreports",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  query([
    "company",
    "branch",
    "sort",
    "status",
    "invoiceDate1",
    "invoiceDate2",
    "approveDate1",
    "approveDate2",
    "deparDate1",
    "deparDate2",
    "product",
  ])
    .optional()
    .isString(),
  query(["limit", "skip"]).optional().toInt().isInt(),
  query(["noPending"]).optional(),
  validator,
  InvoiceController.getProductReports
);

router.get(
  "/icmal",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
      AuthModel.TYPE_EXIT,
    ],
  }),
  query([
    "company",
    "branch",
    "sort",
    "status",
    "invoiceDate1",
    "invoiceDate2",
    "approveDate1",
    "approveDate2",
    "deparDate1",
    "deparDate2",
  ])
    .optional()
    .isString(),
  query(["limit", "skip"]).optional().toInt().isInt(),
  query(["noPending"]).optional(),
  validator,
  InvoiceController.getIcmal
);

// router.get(
//   "/agencies",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_ADMIN,AuthModel.TYPE_USER],
//   }),
//   validator,
//   UserController.getAgencies
// );
// router.get(
//   "/managers",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_ADMIN,AuthModel.TYPE_USER],
//   }),
//   validator,
//   UserController.getManagers
// );
// router.get(
//   "/:userId",
//   routeGuard({
//     allowedTypes: [
//       AuthModel.TYPE_ADMIN,
//       AuthModel.TYPE_USER,
//     ],
//   }),
//   param("userId").exists().isMongoId(),
//   validator,
//   UserController.getUserWithById
// );
// router.put(
//   "/:userId",
//   routeGuard({
//     allowedTypes: [
//       AuthModel.TYPE_ADMIN,
//       AuthModel.TYPE_USER,
//     ],
//   }),
//   param("userId").exists().isMongoId(),
//   body(["user"]).exists(),
//   validator,
//   UserController.updateUserWithById
// );
// router.post(
//   "/:userId/change-user-status",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_ADMIN, AuthModel.TYPE_USER],
//   }),
//   param("userId").exists().isMongoId(),
//   body(["userStatus"]).exists(),
//   validator,
//   UserController.changeUserStatusWithById
// );
// router.post(
//   "/:userId/receipt",
//   routeGuard({
//     allowedTypes: [
//       AuthModel.TYPE_ADMIN,
//       AuthModel.TYPE_USER,
//     ],
//   }),
//   param("userId").exists().isMongoId(),
//   body(["description"]).exists(),
//   body(["amount"]).exists().toInt().isInt(),
//   body(["receiptDate"]).exists().isISO8601(),
//   validator,
//   UserController.addReceiptWithById
// );
// router.delete(
//   "/:userId/receipt/:createDate",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_ADMIN, AuthModel.TYPE_USER],
//   }),
//   param("userId").exists().isMongoId(),
//   param(["createDate"]).exists(),
//   validator,
//   UserController.deleteOneReceipt
// );
// router.post(
//   "/:userId/changestatus",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_ADMIN],
//   }),
//   param("userId").exists().isMongoId(),
//   body(["newStatus"]).optional(),
//   body(["newUserStatus"]).optional(),

//   validator,
//   UserController.changeStatusWithById
// );

module.exports = router;
