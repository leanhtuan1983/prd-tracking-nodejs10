const db = require("../models/db");

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}
// ========= Tạo và chỉnh sửa ca/kíp ==========

exports.index = (req, res) => {
  res.render("settings/shift/index");
};

exports.shiftList = async (req, res) => {
  try {
    const [results] = await query("SELECT * FROM shifts");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

exports.createForm = (req, res) => {
  res.render("settings/shift/create");
};

exports.add = async (req, res) => {
  const { name, started_at, finished_at } = req.body;

  // Hiệu số giờ
  let start = new Date(`1970-01-01T${started_at}Z`);
  let finish = new Date(`1970-01-01T${finished_at}Z`);

  let diff = (finish - start) / (1000 * 60 * 60); // Quy đổi giây thành giờ

  // Nếu ra kết quả âm => Qua ngày hôm sau
  if (diff < 0) {
    diff += 24;
  }

  // Nếu kết quả = 0 => Làm 24h
  if (diff === 0) {
    diff = 24;
  }
  try {
    await query(
      `INSERT INTO shifts (name, started_at, finished_at) VALUES (?, ?, ?)`,
      [name, started_at, finished_at]
    );
    res.json({ success: true, message: "Thêm thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm ca:", err.sqlMessage || err.message);
    console.error("SQL gây lỗi:", err.sql);
    res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
  }
};

exports.shiftDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query(
      "SELECT name, DATE_FORMAT(started_at, '%H:%i') AS started_at, DATE_FORMAT(finished_at, '%H:%i') AS finished_at FROM shifts WHERE id = ?",
      [id]
    );
    if (results.length > 0) {
      res.json({ success: true, data: results[0] });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thông tin" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn dữ liệu" });
  }
};

exports.editForm = (req, res) => {
  res.render("settings/shift/edit");
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { name, started_at, finished_at } = req.body;

  // Hiệu số giờ
  let start = new Date(`1970-01-01T${started_at}Z`);
  let finish = new Date(`1970-01-01T${finished_at}Z`);

  let diff = (finish - start) / (1000 * 60 * 60); // Quy đổi giây thành giờ

  // Nếu ra kết quả âm => Qua ngày hôm sau
  if (diff < 0) {
    diff += 24;
  }

  // Nếu kết quả = 0 => Làm 24h
  if (diff === 0) {
    diff = 24;
  }
  try {
    await query(
      "UPDATE shifts SET name = ?, started_at = ?, finished_at = ? WHERE id = ?",
      [name, started_at, finished_at, id]
    );
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM shifts WHERE id = ?", [id]);
    res.json({ success: true, message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi xóa dữ liệu" });
  }
};

// ========== Phân Ca/Kíp và giao target cho từng bộ phận ==========

exports.assignments = (req, res) => {
  res.render("settings/shift/assignment");
};

// Sửa lại exports.assignmentList
exports.assignmentList = async (req, res) => {
  try {
    const [results] = await query(`
      SELECT 
        d.id AS department_id, 
        d.name AS department_name, 
        s.name AS shift_name, 
        s.started_at AS start_time, 
        s.finished_at AS end_time, 
        s.duration_hours AS duration, 
        dst.target AS target
      FROM departments d 
      LEFT JOIN department_shift_target dst ON d.id = dst.department_id
      LEFT JOIN shifts s ON dst.shift_id = s.id 
      WHERE d.mission = 'operating'
    `);
    res.json({ success: true, data: results });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi truy vấn dữ liệu", err });
  }
};

exports.saveAssignment = async (req, res) => {
  const { assignment_id, department_id, shift_id, target } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!department_id || !shift_id || !target) {
    return res.json({ success: false, message: "Thiếu thông tin cần thiết" });
  }

  try {
    if (assignment_id) {
      // Đây là bản ghi đã tồn tại, tiến hành UPDATE
      await query(
        "UPDATE department_shift_target SET shift_id = ?, target = ? WHERE id = ?",
        [shift_id, target, assignment_id]
      );
    } else {
      // Đây là bản ghi mới, tiến hành INSERT
      // Cần xóa bản ghi cũ (nếu có) để tránh trùng lặp
      await query(
        "DELETE FROM department_shift_target WHERE department_id = ?",
        [department_id]
      );

      await query(
        "INSERT INTO department_shift_target (department_id, shift_id, target) VALUES (?, ?, ?)",
        [department_id, shift_id, target]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi khi lưu dữ liệu" });
  }
};
