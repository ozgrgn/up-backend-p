const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers");
const AuthModel = require("../../auth/model/index");
const { body, query, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");

// companies
router.get(
  "/",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN,AuthModel.TYPE_EXIT],
  }),
  validator,
  CompanyController.getCompanies
);

router.post(
  "/",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN],
  }),
  body([
    "name",
  ])
    .exists()
    .isString(),
  
  validator,
  CompanyController.addCompany
);
router.get(
  "/:companyId",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN],
  }),
  param("companyId").exists().isMongoId(),
  validator,
  CompanyController.getCompany
);

router.put(
  "/company",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN
    ],
  }),
  body(["company"]).exists(),
  validator,
  CompanyController.updateCompany
);

router.delete(
  "/company/:id",
  routeGuard({
    allowedTypes: [
     AuthModel.TYPE_SUPERADMIN
    ],
  }),
  param("id").exists().isMongoId(),
  validator,
  CompanyController.deleteCompany
);


module.exports = router;
