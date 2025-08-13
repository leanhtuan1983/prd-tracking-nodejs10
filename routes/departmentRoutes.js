const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Kiểm tra đăng nhập
router.use(isAuthenticated);

// Danh sách phòng ban
router.get("/", departmentController.index);
router.get("/list", departmentController.list);

// Thêm phòng ban
router.get("/add", departmentController.addForm);
router.post("/add", departmentController.add);

//Chi tiết phòng ban
router.get("/detail/:id", departmentController.detail);

// Sửa phòng ban
router.get("/edit/:id", departmentController.editForm);
router.post("/update/:id", departmentController.update);

// Xóa phòng ban
router.get("/delete/:id", departmentController.remove);

module.exports = router;
