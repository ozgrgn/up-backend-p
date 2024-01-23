const express = require("express");
const router = express.Router();
const ProductController = require("../controllers");
const AuthModel = require("../../auth/model/index");
const { body, query, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");

router.post(
  "/category",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN],
  }),
  body([
    "category",
  ])
    .exists()
    .isString(),
  
  validator,
  ProductController.addCategory
);

router.get(
  "/categories",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN,AuthModel.TYPE_ADMIN,AuthModel.TYPE_USER],
  }),
  validator,
  ProductController.getCategories
);
router.put(
  "/category",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN
    ],
  }),
  body(["category"]).exists(),
  validator,
  ProductController.updateCategory
);

router.post(
  "/product/:category",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_SUPERADMIN],
  }),
  body([
    "product"
  ])
    .exists(),
 param("category").exists().isMongoId(),

  
  validator,
  ProductController.addProduct
);

router.delete(
  "/category/:id",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_SUPERADMIN
    ],
  }),
  param("id").exists().isMongoId(),
  validator,
  ProductController.deleteCategory
);


module.exports = router;
