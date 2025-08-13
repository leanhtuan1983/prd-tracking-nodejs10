const express = require("express");
const router = express.Router();
const lotController = require("../controllers/lotController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Kiểm tra đăng nhập
router.use(isAuthenticated);

// Danh sách lot_code
router.get("/", lotController.index);
router.get("/list", lotController.list);

// Thêm lot
router.get("/add", lotController.addForm);
router.post("/add", lotController.add);

// Chi tiết lot
router.get("/detail/:id", lotController.detail);

// Sửa lot
router.get("/edit/:id", lotController.editForm);
router.post("/update/:id", lotController.update);

// Xóa lot
router.get("/delete/:id", lotController.remove);

module.exports = router;
