const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Kiểm tra đăng nhập
router.use(isAuthenticated);

// Hiển thị view log
router.get("/", logController.index);
router.get("/list", logController.list);
router.get("/export/excel", logController.exportExcel);

module.exports = router;
