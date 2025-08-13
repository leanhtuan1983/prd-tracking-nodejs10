//Kêt nối Database
const db = require("../models/db");

//Hiển thị trang index
exports.index = (req, res) => {
  res.render("departments/index");
};

//Lấy danh sách
exports.list = async (req, res) => {
  try {
    const [results] = await query("SELECT * FROM departments");
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Lỗi truy vấn departments:", err);
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};
//Hiển thị trang thêm mới
exports.addForm = (req, res) => {
  res.render("departments/add");
};

//Thêm mới
exports.add = async (req, res) => {
  const { name, mission } = req.body;
  try {
    await query("INSERT INTO departments (name, mission) VALUE (?, ?)", [
      name,
      mission,
    ]);
    res.json({ success: true, message: "Thêm thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};

//Hiển thị trang edit
exports.editForm = (req, res) => {
  res.render("departments/edit");
};

//Lấy thông tin chi tiết 1 data
exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM departments WHERE id = ?", [
      id,
    ]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thây dữ liệu" });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

//Cập nhật
exports.update = async (req, res) => {
  const id = req.params.id;
  const { name, mission } = req.body;
  try {
    await query("UPDATE departments SET name = ?, mission =? WHERE id = ?", [
      name,
      mission,
      id,
    ]);
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật thất bại" });
  }
};

//Xóa
exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM departments WHERE id = ?", [id]);
    res.json({ success: true, message: "Xóa thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Xóa thất bại" });
  }
};
// Hàm util để dùng Promise với db.query
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}
