const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");

const {
  isAuthenticated,
  checkRoles,
} = require("../middlewares/roleMiddleware");

router.use(isAuthenticated); // Yêu cầu đăng nhập

// Danh sách users
router.get("/", checkRoles("admin"), permissionController.index);
router.get("/list", checkRoles("admin"), permissionController.list);

// Thiết lập phân quyền
router.get("/givePermissionForm/:id", permissionController.givePermissionForm);
router.get("/getUserPermission/:id", permissionController.getPermissionsByUser);
router.post("/postPermission/:id", permissionController.postPermissionForUser);

module.exports = router;
