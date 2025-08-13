const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");

const {
  isAuthenticated,
  checkRoles,
} = require("../middlewares/roleMiddleware");

router.use(isAuthenticated); // Yêu cầu đăng nhập

//==================== Khởi tạo ca/kíp ==========
router.get(
  "/shift",
  checkRoles("admin", "dept-manager"),
  settingController.index
);

router.get(
  "/shift/list",
  checkRoles("admin", "dept-manager"),
  settingController.shiftList
);

router.get(
  "/shift/create",
  checkRoles("admin", "dept-manager"),
  settingController.createForm
);

router.post(
  "/shift/add",
  checkRoles("admin", "dept-manager"),
  settingController.add
);

router.get(
  "/shift/edit/:id",
  checkRoles("admin", "dept-manager"),
  settingController.editForm
);

router.get(
  "/shift/detail/:id",
  checkRoles("admin", "dept-manager"),
  settingController.shiftDetail
);

router.post(
  "/shift/update/:id",
  checkRoles("admin", "dept-manager"),
  settingController.update
);

router.get(
  "/shift/delete/:id",
  checkRoles("admin", "dept-manager"),
  settingController.remove
);

// ==================== Phân ca và giao target

router.get(
  "/shift/assignment",
  checkRoles("admin", "dept-manager"),
  settingController.assignments
);

router.get(
  "/shift/assignmentList",
  checkRoles("admin", "dept-manager"),
  settingController.assignmentList
);

router.post(
  "/shift/assignment/save",
  checkRoles("admin", "dept-manager"),
  settingController.saveAssignment
);

module.exports = router;
