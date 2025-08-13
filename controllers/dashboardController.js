const db = require("../models/db");

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}

exports.showDashboard = (req, res) => {
  res.render("dashboard", {
    title: "Trang chủ quản lý",
    user: req.session.user,
  });
};

exports.showDepartment = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT name FROM departments WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi truy vấn DB");
      }
      if (results.length === 0) {
        return res.status(404).send("Không tìm thấy phòng ban");
      }

      const deptName = results[0].name;

      res.render("departments/showDetails", {
        title: `Bộ phận - ${deptName}`,
        name: deptName,
      });
    }
  );
};

exports.departmentLink = async (req, res) => {
  try {
    const [results] = await query(
      `SELECT * FROM departments WHERE mission = "operating"`
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).send({ success: false, message: "Lỗi tải dữ liệu" });
  }
};

exports.showDepartmentDetail = async (req, res) => {
  const deptId = req.params.id;
  try {
    const [results] = await query(
      `SELECT ppt.*, l.lot_code, p.name AS product_name, prc.name AS process_name, d.name AS department_name 
    FROM product_process_tracking ppt
    INNER JOIN lots l ON ppt.lot_id = l.id
    INNER JOIN products p ON ppt.product_id = p.id 
    INNER JOIN processes prc ON ppt.process_id = prc.id 
    INNER JOIN departments d ON prc.department_id = d.id 
    WHERE department_id = ?
    ORDER BY ppt.lot_id `,
      [deptId]
    );
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Không thể tải dữ liệu" });
  }
};
exports.totalDashboard = async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT SUM(l.quantity) AS total_quantity
      FROM lots l
      WHERE l.id IN (
        SELECT ppt.lot_id
        FROM product_process_tracking ppt
        GROUP BY ppt.lot_id
        HAVING COUNT(*) = SUM(CASE WHEN ppt.status = 'completed' THEN 1 ELSE 0 END)
      )
      AND DATE(l.created_at) = CURDATE()
    `);

    res.json({ total_quantity: rows[0].total_quantity || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi truy vấn tổng sản lượng" });
  }
};
