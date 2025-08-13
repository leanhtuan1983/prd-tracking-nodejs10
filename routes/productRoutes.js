const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Kiểm tra đăng nhập
router.use(isAuthenticated);

// Danh sách sản phẩm
router.get("/", productController.index);
router.get("/list", productController.list);

// Thêm sản phẩm
router.get("/add", productController.addForm);
router.post("/add", productController.add);

//Thông tin sản phẩm
router.get("/detail/:id", productController.detail);

// Sửa sản phẩm
router.get("/edit/:id", productController.editForm);
router.post("/update/:id", productController.update);

// Xóa sản phẩm
router.get("/delete/:id", productController.remove);

module.exports = router;
