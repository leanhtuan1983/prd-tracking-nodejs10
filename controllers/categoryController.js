//=============================================================================
// Kết nối CSDL
//------------------------------------
const db = require("../models/db");

//=============================================================================
// Lấy danh sách (Phương pháp truyền thống)
//-------------------------------------
// exports.list = (req, res) => {
//   db.query("SELECT * FROM categories", (err, results) => {
//     if (err) return res.send("Lỗi truy vấn");
//     res.render("categories/index", { categories: results });
//   });
// };
//--------------------------------------
// Render trang index
//--------------------------------------
exports.index = (req, res) => {
  res.render("categories/index");
};
//--------------------------------------
// Lấy danh sách bằng fetch
//--------------------------------------
exports.list = async (req, res) => {
  try {
    const [results] = await query(
      "SELECT c.*, u.username AS username FROM categories c INNER JOIN users u ON c.user_id = u.id"
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};
//=============================================================================
// Hiển thị form thêm mới category
//----------------------------------------
exports.addForm = (req, res) => {
  res.render("categories/add");
};

//----------------------------------------
// Thêm mới category (Phương pháp truyền thống)
//----------------------------------------
// exports.add = (req, res) => {
//   const { name } = req.body;
//   db.query("INSERT INTO categories (name) VALUES (?)", [name], (err) => {
//     if (err) return res.send("Lỗi thêm dữ liệu");
//     res.redirect("/categories");
//   });
// };

//----------------------------------------
// Thêm mới category bằng fetch
//---------------------------------------
exports.add = async (req, res) => {
  const { name } = req.body;
  const user_id = req.session && req.session.user ? req.session.user.id : 0;
  try {
    await query("INSERT INTO categories (name, user_id) VALUES (?, ?)", [
      name,
      user_id,
    ]);
    res.json({ success: true, message: "Thêm thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};
//=============================================================================
// Form sửa thông tin
//-----------------------------------------
exports.editForm = (req, res) => {
  res.render("categories/edit");
};
//------------------------------------------
// Hàm cập nhật thông tin (Phương pháp truyền thống)
//------------------------------------------
// exports.update = (req, res) => {
//   const id = req.params.id;
//   const { name } = req.body;
//   db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id], (err) => {
//     if (err) res.send("Lỗi cập nhật");
//     res.redirect("/categories");
//   });
// };
//------------------------------------------
// Hàm cập nhật thông tin bằng fetch
//------------------------------------------
exports.update = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    await query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật" });
  }
};
//=============================================================================
// Hàm remove truyền thống
//-------------------------------------------
// exports.remove = (req, res) => {
//   const id = req.params.id;
//   db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
//     if (err) return res.send("Lỗi xóa dữ liệu");
//     res.redirect("/categories");
//   });
// };
//-------------------------------------------
// Hàm remove bằng fetch
//-------------------------------------------
exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM categories WHERE id =?", [id]);
    res.json({ success: true, message: "Xóa dữ liệu thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Xóa dữ liệu thất bại" });
  }
};
//=============================================================================
// Hàm lấy thông tin chi tiết 1 dữ liệu bằng fetch
//---------------------------------------------
exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy dữ liệu" });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

//=============================================================================
// Hàm util để dùng Promise với db.query
//------------------------------------------------
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}
