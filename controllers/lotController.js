const db = require("../models/db");

exports.index = (req, res) => {
  res.render("lots/index");
};

exports.list = async (req, res) => {
  try {
    const [results] = await query(
      `SELECT l.*, p.name AS product_name, u.username AS username FROM lots l INNER JOIN products p ON l.product_id = p.id INNER JOIN users u ON l.user_id = u.id`
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi tải dữ liệu" });
  }
};

exports.addForm = (req, res) => {
  res.render("lots/add");
};

exports.add = async (req, res) => {
  const { lot_code, product_id, quantity, allow_rework } = req.body;
  const user_id = req.session && req.session.user ? req.session.user.id : 0;
  try {
    if (!/^\d{1,10}$/.test(lot_code)) {
      return res.status(400).json({
        success: false,
        message: "Lot code không hợp lệ, phải nhập đủ 10 ký tự",
      });
    } else {
      await query(
        "INSERT INTO lots (lot_code, product_id, quantity, allow_rework, user_id) VALUES (?, ?, ?, ?, ?)",
        [lot_code, product_id, quantity, 0, user_id]
      );
      res.json({ success: true, message: "Thêm thành công" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};

exports.editForm = (req, res) => {
  res.render("lots/edit");
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM lots WHERE id = ?", [id]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lot" });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

exports.update = async (req, res) => {
  const { lot_code, product_id, quantity, allow_rework } = req.body;
  const id = req.params.id;
  try {
    await query(
      "UPDATE lots SET lot_code = ?, product_id = ?, quantity = ?, allow_rework =? WHERE id = ?",
      [lot_code, product_id, quantity, allow_rework, id]
    );
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật thất bại" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM lots WHERE id = ?", [id]);
    res.json({ success: true, message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Xóa sản phẩm thất bại" });
  }
};

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}
