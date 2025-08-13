const express = require("express");
const router = express.Router();
const procedureController = require("../controllers/procedureController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Kiểm tra đăng nhập
router.use(isAuthenticated);

// Danh sách Procedure
router.get("/", procedureController.index);
router.get("/list", procedureController.list);

// Thêm Procedure
router.get("/add", procedureController.addForm);
router.post("/add", procedureController.add);

// Chi tiết procedure
router.get("/detail/:id", procedureController.detail);

// Sửa procedure
router.get("/edit/:id", procedureController.editForm);
router.post("update/:id", procedureController.update);

// Xóa procedure
router.get("/delete/:id", procedureController.remove);

module.exports = router;
