const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Middleware kiểm tra đăng nhập
router.use(isAuthenticated);

// ========== WEB ROUTES ==========
// Route để render giao diện HTML
router.get("/", categoryController.index);
router.get("/add", categoryController.addForm);
router.get("/edit/:id", categoryController.editForm);

// ========== API ROUTES (FETCH) ==========
// Danh sách tất cả categories (trả JSON)
router.get("/list", categoryController.list);

// Lấy chi tiết 1 category
router.get("/detail/:id", categoryController.detail);

// Thêm mới category
router.post("/add", categoryController.add);

// Cập nhật category
router.post("/update/:id", categoryController.update);

// Xóa category
router.get("/delete/:id", categoryController.remove);

module.exports = router;
