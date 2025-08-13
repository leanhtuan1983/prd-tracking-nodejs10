const db = require("../models/db");

exports.index = (req, res) => {
  res.render("processes/index");
};

exports.list = async (req, res) => {
  try {
    const [results] = await query(
      "SELECT prc.*, prd.name AS procedure_name, dept.name AS department_name, u.username AS username FROM processes prc INNER JOIN procedures prd ON prc.procedure_id = prd.id INNER JOIN departments dept ON prc.department_id = dept.id INNER JOIN users u ON prc.user_id = u.id ORDER BY prc.id ASC"
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn" });
  }
};

exports.addForm = (req, res) => {
  res.render("processes/add");
};

exports.add = async (req, res) => {
  const { name, procedure_id, department_id } = req.body;
  const user_id = req.session && req.session.user ? req.session.user.id : 0;
  // console.log("==> Dữ liệu thêm process:", {
  //   name,
  //   procedure_id,
  //   department_id,
  //   user_id,
  // }); --> Test dữ liệu
  try {
    await query(
      `INSERT INTO processes (name, procedure_id, department_id, user_id) VALUES (?,?,?,?)`,
      [name, procedure_id, department_id, user_id]
    );
    res.json({ success: true, message: "Thêm thành công" });
  } catch (err) {
    console.error("Lỗi thêm process:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi thêm dữ liệu",
      error: err.message, // Hiển thị thông báo lỗi cụ thể
    });
  }
};

exports.editForm = (req, res) => {
  // const id = req.params.id;
  // const processQuery = `SELECT * FROM processes WHERE id = ?`;
  // const procedureQuery = `SELECT * FROM procedures`;
  // const departmentQuery = `SELECT * FROM departments`;
  // db.query(processQuery, [id], (err, processes) => {
  //   if (err || processes.length === 0)
  //     return res.send("Không tìm thấy process");
  //   const process = processes[0];
  //   db.query(procedureQuery, (err, procedures) => {
  //     if (err) return res.send("Lỗi truy vấn Procedure");
  //     db.query(departmentQuery, (err, departments) => {
  //       if (err) return res.send("Lỗi truy vấn Phòng ban");
  res.render(
    "processes/edit"
    // , { process, procedures, departments }
  );
  //     });
  //   });
  // });
};
exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await query("SELECT * FROM processes WHERE id = ?", [id]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi fetch dữ liệu" });
  }
};

exports.update = async (req, res) => {
  const { name, procedure_id, department_id } = req.body;
  const id = req.params.id;
  try {
    await query(
      "UPDATE processes SET name = ?, procedure_id = ?, department_id = ? WHERE id = ?",
      [name, procedure_id, department_id, id]
    );
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật thất bại" });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  try {
    await query("DELETE FROM processes WHERE id =?", [id]);
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
