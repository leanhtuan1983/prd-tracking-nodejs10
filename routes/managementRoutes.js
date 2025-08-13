const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const lotController = require("../controllers/lotController");
const procedureController = require("../controllers/procedureController");
const processController = require("../controllers/processController");

const {
  isAuthenticated,
  checkRoles,
} = require("../middlewares/roleMiddleware");

router.use(isAuthenticated); // Yêu cầu đăng nhập

// CRUD đối với categories cho admin và product-manager
router.get(
  "/categories",
  checkRoles("admin", "product-manager"),
  categoryController.index
);
router.get(
  "/category-list",
  checkRoles("admin", "product-manager", "engineer"),
  categoryController.list
);
router.get(
  "/categories/add",
  checkRoles("admin", "product-manager"),
  categoryController.addForm
);
router.post(
  "/categories/create",
  checkRoles("admin", "product-manager"),
  categoryController.add
);
router.get(
  "/categories/detail/:id",
  checkRoles("admin", "product-manager"),
  categoryController.detail
);
router.get(
  "/categories/edit/:id",
  checkRoles("admin", "product-manager"),
  categoryController.editForm
);
router.post(
  "/categories/update/:id",
  checkRoles("admin", "product-manager"),
  categoryController.update
);
router.get(
  "/categories/delete/:id",
  checkRoles("admin", "product-manager"),
  categoryController.remove
);

//.............

// CRUD đối với product cho admin và product-manager
router.get(
  "/products",
  checkRoles("admin", "product-manager"),
  productController.index
);
router.get(
  "/products/list",
  checkRoles("admin", "product-manager"),
  productController.list
);
router.get(
  "/products/add",
  checkRoles("admin", "product-manager"),
  productController.addForm
);
router.post(
  "/products/create",
  checkRoles("admin", "product-manager"),
  productController.add
);
router.get(
  "/products/detail/:id",
  checkRoles("admin", "product-manager"),
  productController.detail
);
router.get(
  "/products/edit/:id",
  checkRoles("admin", "product-manager"),
  productController.editForm
);
router.post(
  "/products/update/:id",
  checkRoles("admin", "product-manager"),
  productController.update
);
router.get(
  "/products/delete/:id",
  checkRoles("admin", "product-manage"),
  productController.remove
);
//..............

// CRUD đối với lots cho admin và product-manager
router.get(
  "/lots",
  checkRoles("admin", "product-manager"),
  lotController.index
);
router.get(
  "/lots/list",
  checkRoles("admin", "product-manager"),
  lotController.list
);
router.get(
  "/lots/add",
  checkRoles("admin", "product-manager"),
  lotController.addForm
);
router.post(
  "/lots/create",
  checkRoles("admin", "product-manager"),
  lotController.add
);
router.get(
  "/lots/detail/:id",
  checkRoles("admin", "product-manager"),
  lotController.detail
);
router.get(
  "/lots/edit/:id",
  checkRoles("admin", "product-manager"),
  lotController.editForm
);
router.post(
  "/lots/update/:id",
  checkRoles("admin", "product-manager"),
  lotController.update
);
router.get(
  "/lots/delete/:id",
  checkRoles("admin", "product-manager"),
  lotController.remove
);
//..............

// CRUD đối với procedures cho admin và engineer
router.get(
  "/procedures",
  checkRoles("admin", "engineer"),
  procedureController.index
);
router.get(
  "/procedures/list",
  checkRoles("admin", "engineer"),
  procedureController.list
);
router.get(
  "/procedures/add",
  checkRoles("admin", "engineer"),
  procedureController.addForm
);
router.post(
  "/procedures/create",
  checkRoles("admin", "engineer"),
  procedureController.add
);
router.get(
  "/procedures/detail/:id",
  checkRoles("admin", "engineer"),
  procedureController.detail
);
router.get(
  "/procedures/edit/:id",
  checkRoles("admin", "engineer"),
  procedureController.editForm
);
router.post(
  "/procedures/update/:id",
  checkRoles("admin", "engineer"),
  procedureController.update
);
router.get(
  "/procedures/delete/:id",
  checkRoles("admin", "engineer"),
  procedureController.remove
);

router.get(
  "/procedures/showDetail/:id",
  checkRoles("admin", "engineer"),
  procedureController.showDetail
);
router.get(
  "/procedures/fetchProcedureDetail/:id",
  checkRoles("admin", "engineer"),
  procedureController.fetchProcedureDetail
);

// CRUD đối với processes cho admin và engineer
router.get(
  "/processes",
  checkRoles("admin", "engineer"),
  processController.index
);
router.get(
  "/processes/list",
  checkRoles("admin", "engineer"),
  processController.list
);
router.get(
  "/processes/add",
  checkRoles("admin", "engineer"),
  processController.addForm
);
router.post(
  "/processes/create",
  checkRoles("admin", "engineer"),
  processController.add
);
router.get(
  "/processes/detail/:id",
  checkRoles("admin", "engineer"),
  processController.detail
);
router.get(
  "/processes/edit/:id",
  checkRoles("admin", "engineer"),
  processController.editForm
);
router.post(
  "/processes/update/:id",
  checkRoles("admin", "engineer"),
  processController.update
);
router.get(
  "/processes/delete/:id",
  checkRoles("admin", "engineer"),
  processController.remove
);
module.exports = router;
