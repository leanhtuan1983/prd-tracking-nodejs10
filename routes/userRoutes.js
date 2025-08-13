const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

//====================================================================
// Kiểm tra đăng nhập
router.use(isAuthenticated);
//===================================================================
// Danh sách người dùng
router.get("/", userController.index);
router.get("/list", userController.list);
//===================================================================
// Thêm người dùng
router.get("/add", userController.addForm);
router.post("/add", userController.add);
//===================================================================
// Sửa người dùng
router.get("/edit/:id", userController.editForm);
router.post("/update/:id", userController.update);
//===================================================================
// Chi tiết người dùng
router.get("/detail/:id", userController.detail);
//===================================================================
// Xóa người dùng
router.get("/delete/:id", userController.remove);
module.exports = router;
