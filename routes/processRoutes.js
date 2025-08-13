const express = require("express");
const router = express.Router();
const processController = require("../controllers/processController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Yêu cầu đăng nhập
router.use(isAuthenticated);

// Danh sách processes
router.get("/", processController.index);
router.get("/list", processController.list);

// Thêm process
router.get("/add", processController.addForm);
router.post("/add", processController.add);

// Chi tiết process
router.get("/detail/:id", processController.detail);

// Sửa process
router.get("/edit/:id", processController.editForm);
router.post("/update/:id", processController.update);

// Xóa process
router.get("/delete/:id", processController.remove);

module.exports = router;
