const express = require("express");
const router = express.Router();
const initialTrackingController = require("../controllers/initTrackingController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Middleware kiểm tra đăng nhập
router.use(isAuthenticated);

// Khởi tạo tracking
router.get("/", initialTrackingController.initialForm);
router.post("/initialization", initialTrackingController.initTracking);

module.exports = router;
