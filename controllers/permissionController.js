const db = require("../models/db");

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}
// Render trang hiển thị danh sách
exports.index = (req, res) => {
  res.render("permissions/index");
};

// Lấy dữ liệu cho trang index
exports.list = async (req, res) => {
  try {
    const [results] = await query(
      `SELECT 
        u.id AS user_id,
        u.username as username,
        u.role as role,
        d1.name AS original_department,
        GROUP_CONCAT(DISTINCT d2.name ORDER BY d2.name SEPARATOR ', ') AS permitted_departments
      FROM users u
      LEFT JOIN departments d1 ON u.department_id = d1.id
      LEFT JOIN user_department_permissions udp ON u.id = udp.user_id
      LEFT JOIN departments d2 ON udp.department_id = d2.id
      GROUP BY u.id, u.username, u.role, d1.name;
    `
    );
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Lỗi tải permissions:", err);
    res.status(500).send("Lỗi hệ thống server");
  }
};

// Render trang phân quyền cho 1 user
exports.givePermissionForm = (req, res) => {
  res.render("permissions/givePermissionForm");
};

// Lấy thông tin đã phân quyền trước đó của user
exports.getPermissionsByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await query(
      `SELECT department_id FROM user_department_permissions WHERE user_id = ?`,
      [userId]
    );
    const departmentIds = rows.map((r) => r.department_id);
    res.json({ success: true, data: departmentIds });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phân quyền:", err);
    res.json({ success: false, message: "Lỗi server khi lấy phân quyền" });
  }
};

// Thiết lập phân quyền và lưu vào database
exports.postPermissionForUser = async (req, res) => {
  const user_id = req.params.id;

  let checked_department_ids = req.body.permitted_department_id || [];

  if (!Array.isArray(checked_department_ids)) {
    checked_department_ids = [checked_department_ids];
  }

  if (checked_department_ids.length === 0) {
    return res.status(400).send("Vui lòng chọn 1 phòng ban");
  }

  try {
    await query(`DELETE FROM user_department_permissions WHERE user_id = ?`, [
      user_id,
    ]);

    const values = checked_department_ids.map((depId) => [user_id, depId]);
    await query(
      `INSERT INTO user_department_permissions (user_id, department_id) VALUES ?`,
      [values]
    );

    res.json({ success: true, message: "Phân quyền thành công" });
  } catch (err) {
    console.error("Lỗi lưu phân quyền:", err);
    res.status(500).send("Lỗi hệ thống");
  }
};
