const db = require("../models/db");

exports.index = (req, res) => {
  res.render("procedures/index");
};

exports.list = async (req, res) => {
  try {
    const [results] = await query(
      "SELECT p.*, c.name AS category_name, u.username AS username FROM procedures p INNER JOIN categories c ON p.category_id = c.id INNER JOIN users u ON p.user_id = u.id"
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn" });
  }
};

exports.addForm = (req, res) => {
  res.render("procedures/add");
};

exports.add = async (req, res) => {
  const { name, category_id } = req.body;
  const user_id = req.session && req.session.user ? req.session.user.id : 0;
  try {
    await query(
      "INSERT INTO procedures (name, category_id, user_id) VALUES (?,?,?)",
      [name, category_id, user_id]
    );
    res.json({ success: true, message: "Thêm thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};

exports.editForm = (req, res) => {
  res.render("procedures/edit");
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM procedures WHERE id = ?", [
      id,
    ]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy procedure" });
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
    await query(
      "UPDATE procedures SET name = ?, category_id = ? WHERE id = ?",
      [name, category_id, id]
    );
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật thất bại" });
  }
};

exports.showDetail = async (req, res) => {
  const procedure_id = req.params.id;
  try {
    const [[procedure]] = await query("SELECT * FROM procedures WHERE id = ?", [
      procedure_id,
    ]);

    if (!procedure) return res.status(404).send("Quy trình không tồn tại");

    res.render("procedures/showDetail", { procedure });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).send("Lỗi truy vấn");
  }
};

exports.fetchProcedureDetail = async (req, res) => {
  const procedure_id = req.params.id;
  try {
    const [results] = await query(
      `SELECT prc.name AS process_name, prd.name AS procedure_name, d.name AS department_name, u.username AS username FROM processes prc 
       INNER JOIN procedures prd ON prc.procedure_id = prd.id 
       INNER JOIN departments d ON prc.department_id = d.id
       INNER JOIN users u ON prc.user_id = u.id
       WHERE prc.procedure_id = ?`,
      [procedure_id]
    );
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có process nào cho Quy trình này",
      });
    }
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM procedures WHERE id = ?", [id]);
    res.json({ success: true, message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Xóa thất bại" });
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
