const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const departmentController = require("../controllers/departmentController");

const {
  isAuthenticated,
  checkRoles,
} = require("../middlewares/roleMiddleware");

router.use(isAuthenticated); // Yêu cầu đăng nhập

// CRUD Users
router.get("/users", checkRoles("admin"), userController.index);
router.get("/user-list", checkRoles("admin"), userController.list);
router.get("/users/add", checkRoles("admin"), userController.addForm);
router.post("/users/create", checkRoles("admin"), userController.add);
router.get("/users/edit/:id", checkRoles("admin"), userController.editForm);
router.post("/users/update/:id", checkRoles("admin"), userController.update);
router.get("/users/detail/:id", checkRoles("admin"), userController.detail);
router.get("/users/delete/:id", checkRoles("admin"), userController.remove);

// CRUD Departments
router.get("/departments", checkRoles("admin"), departmentController.index);
router.get(
  "/department-list",
  checkRoles(
    "admin",
    "engineer",
    "dept-manager",
    "operator",
    "product-manager"
  ),
  departmentController.list
);
router.get(
  "/departments/add",
  checkRoles("admin"),
  departmentController.addForm
);
router.post(
  "/departments/create",
  checkRoles("admin"),
  departmentController.add
);
router.get(
  "/departments/edit/:id",
  checkRoles("admin"),
  departmentController.editForm
);
router.get(
  "/departments/detail/:id",
  checkRoles("admin"),
  departmentController.detail
);
router.post(
  "/departments/update/:id",
  checkRoles("admin"),
  departmentController.update
);
router.get(
  "/departments/delete/:id",
  checkRoles("admin"),
  departmentController.remove
);

module.exports = router;
