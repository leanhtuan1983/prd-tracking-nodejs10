const db = require("../models/db");

exports.index = (req, res) => {
  res.render("products/index");
};

exports.list = async (req, res) => {
  try {
    const [results] = await query(
      "SELECT p.*, c.name AS category_name, u.username AS username FROM products p INNER JOIN categories c ON p.category_id = c.id INNER JOIN users u ON p.user_id = u.id"
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn!" });
  }
};

exports.addForm = (req, res) => {
  res.render("products/add");
};

exports.add = async (req, res) => {
  const { name, category_id } = req.body;
  const user_id = req.session && req.session.user ? req.session.user.id : 0;
  try {
    await query(
      "INSERT INTO products (name, category_id, user_id) VALUES (?,?,?)",
      [name, category_id, user_id]
    );
    res.json({ success: true, message: "Thêm thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};

exports.editForm = (req, res) => {
  res.render("products/edit");
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM products WHERE id = ?", [id]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

exports.update = async (req, res) => {
  const { name, category_id } = req.body;
  const id = req.params.id;
  try {
    await query("UPDATE products SET name = ?, category_id = ? WHERE id = ?", [
      name,
      category_id,
      id,
    ]);
    res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Cập nhật sản phẩm thất bại" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM products WHERE id =?", [id]);
    res.json({ success: true, message: "Xóa sản phẩm thành công" });
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
