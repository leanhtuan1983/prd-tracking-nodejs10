const express = require("express");
const router = express.Router();
const initTrackingController = require("../controllers/initTrackingController");
const trackingController = require("../controllers/trackingController");

const {
  isAuthenticated,
  checkRoles,
  checkDepartmentPermission,
} = require("../middlewares/roleMiddleware");

// Kiểm tra đăng nhập
router.use(isAuthenticated);

// Khởi tạo tracking
router.get(
  "/initial",
  checkRoles("admin", "dept-manager", "operator"),
  initTrackingController.initialForm
);
router.post(
  "/initial/post",
  checkRoles("admin", "dept-manager", "operator"),
  initTrackingController.initTracking
);

// Danh sách tracking
router.get(
  "/",
  checkRoles("admin", "dept-manager", "operator"),

  trackingController.index
);
router.get(
  "/list",
  checkRoles("admin", "dept-manager", "operator"),
  trackingController.trackingList
);

// Thông tin chi tiết tracking 1 lot hàng
router.get(
  "/detail/:lot_code/:cycle",
  checkRoles("admin", "dept-manager", "operator"),

  trackingController.detailPage
); // render EJS
router.get(
  "/fetchDetail/:lot_code/:cycle",
  checkRoles("admin", "dept-manager", "operator"),

  trackingController.showDetail
); // trả JSON

// Update trạng thái
router.post(
  "/update-status",
  checkRoles("admin", "dept-manager", "operator"),
  checkDepartmentPermission("body", "department_id"),
  trackingController.updateStatus
);

module.exports = router;
