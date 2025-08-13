const db = require("../models/db");

exports.index = (req, res) => {
  res.render("users/index");
};

exports.list = async (req, res) => {
  try {
    const [results] = await query(
      "SELECT u.*, d.name AS department_name FROM users u LEFT JOIN departments d ON u.department_id = d.id"
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(505).json({ success: false, message: "Lỗi truy cập dữ liệu" });
  }
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM users WHERE id = ?", [id]);
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

exports.addForm = (req, res) => {
  db.query("SELECT * FROM departments", (err, departments) => {
    if (err) return res.send("Lỗi lấy danh sách phòng ban");
    res.render("users/add", { departments });
  });
};

exports.add = async (req, res) => {
  const { username, password, role, department_id } = req.body;
  // console.log("Data:", req.body);
  try {
    await query(
      "INSERT INTO users (username, password, role, department_id) VALUES (?,?,?,?)",
      [username, password, role, department_id]
    );
    res.json({ success: true, message: "Thêm thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};

exports.editForm = (req, res) => {
  res.render("users/edit");
};

exports.update = async (req, res) => {
  const { username, password, role, department_id } = req.body;
  const id = req.params.id;
  try {
    await query(
      "UPDATE users SET username = ?, password = ?, role = ?, department_id = ? WHERE id = ?",
      [username, password, role, department_id, id]
    );
    res.json({ success: true, message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật!" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;

  try {
    // 1. Kiểm tra role của user
    const [users] = await query("SELECT role FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    const user = users[0];
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Không thể xóa tài khoản admin!" });
    }

    // 2. Xóa nếu không phải admin
    await query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "Xóa dữ liệu thành công!" });
  } catch (err) {
    console.error("Lỗi khi xóa user:", err);
    res.status(500).json({ success: false, message: "Xóa dữ liệu thất bại" });
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
