const express = require("express");
const router = express.Router();
const UserController = require("../controllers");
const AuthModel = require("../../auth/model/index");
const { body, query, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");

router.post(
  "/",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN,AuthModel.TYPE_ADMIN,AuthModel.TYPE_USER],
  }),
  body([
    "fullName",
    "phone",
    "userType",
    "userLawyerRegNo",
    "userLawyerBench",
    "userLawyerName",
    "userLawyerBank",
    "tcNo",
    "mersis",
    "taxNo",
    "cName",
    "address",
  ])
    .optional()
    .isString(),
  body(["email"]).optional().isEmail(),
  body(["panelMail", "status", "stopaj", "partner", "applicant", "legalPerson"])
    .optional()
    .isBoolean(),
  body(["group"]).optional(),
  validator,
  UserController.addUser
);

router.get(
  "/",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN],
  }),
  query(["fullName", "name", "sort"]).optional().isString(),
  query(["limit", "skip"]).optional().toInt().isInt(),
  query(["status"]).optional().isBoolean(),
  query(["group","userType"]).optional(),
  validator,
  UserController.getUsers
);

router.get(
  "/:userId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
      AuthModel.TYPE_EXIT,
    ],
  }),
  param("userId").exists().isMongoId(),
  validator,
  UserController.getUserWithById
);
router.put(
  "/:userId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN,
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_USER,
    ],
  }),
  param("userId").exists().isMongoId(),
  body(["user"]).exists(),
  validator,
  UserController.updateUserWithById
);

router.delete(
  "/:userId",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN],
  }),
  param("userId").exists().isMongoId(),
 
  validator,
  UserController.deleteUser
);


// router.post(
//   "/:userId/change-user-status",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_SUPERADMIN,AuthModel.TYPE_ADMIN, AuthModel.TYPE_USER],
//   }),
//   param("userId").exists().isMongoId(),
//   body(["userStatus"]).exists(),
//   validator,
//   UserController.changeUserStatusWithById
// );


// router.post(
//   "/:userId/changestatus",
//   routeGuard({
//     allowedTypes: [AuthModel.TYPE_SUPERADMIN],
//   }),
//   param("userId").exists().isMongoId(),
//   body(["newStatus"]).optional(),
//   body(["newUserStatus"]).optional(),

//   validator,
//   UserController.changeStatusWithById
// );

module.exports = router;
