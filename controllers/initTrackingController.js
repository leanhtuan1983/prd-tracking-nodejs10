const db = require("../models/db");

exports.initialForm = (req, res) => {
  res.render("initialTracking/initial");
};

exports.initTracking = async (req, res) => {
  const { lot_code } = req.body;
  const user_id = req.session && req.session.user ? req.session.user.id : 0;

  try {
    // Lấy thông tin lot
    const [lotRows] = await query("SELECT * FROM lots WHERE lot_code = ?", [
      lot_code,
    ]);
    if (lotRows.length === 0)
      return res.json({ success: false, message: "Lot hàng không tồn tại" });

    const lot = lotRows[0];

    // Kiểm tra số lần đã gia công
    const [[{ count }]] = await query(
      "SELECT COUNT(*) AS count FROM product_process_tracking WHERE lot_id = ?",
      [lot.id]
    );

    // Nếu đã tồn tại và không cho phép rework → báo lỗi
    if (count > 0 && !lot.allow_rework) {
      return res.json({
        success: false,
        message: "Lot hàng này không cho phép gia công lại",
      });
    }

    // Tính số lần rework
    let rework_cycle = 0;
    if (count > 0) {
      const [[{ max_cycle }]] = await query(
        "SELECT MAX(rework_cycle) AS max_cycle FROM product_process_tracking WHERE lot_id = ?",
        [lot.id]
      );
      rework_cycle = (max_cycle || 0) + 1;
    }

    // Lấy procedure từ product
    const [procedureRows] = await query(
      `SELECT prd.id AS procedure_id
       FROM procedures prd
       JOIN categories cat ON cat.id = prd.category_id
       WHERE cat.id = (SELECT p.category_id FROM products p WHERE p.id = ?)`,
      [lot.product_id]
    );

    if (procedureRows.length === 0) {
      return res.json({
        success: false,
        message: "Không tìm thấy procedure tương ứng với sản phẩm",
      });
    }

    const procedure_id = procedureRows[0].procedure_id;

    // Lấy danh sách các process theo procedure
    const [processes] = await query(
      "SELECT id AS process_id FROM processes WHERE procedure_id = ? ORDER BY process_order ASC",
      [procedure_id]
    );

    if (processes.length === 0) {
      return res.json({
        success: false,
        message: "Không có process nào cho Procedure này",
      });
    }

    // Tạo dữ liệu để insert
    const values = processes.map((proc) => [
      lot.id,
      lot.product_id,
      proc.process_id,
      user_id,
      "pending",
      null,
      null,
      rework_cycle,
    ]);

    // Insert vào pivot table
    await query(
      `INSERT INTO product_process_tracking
       (lot_id, product_id, process_id, user_id, status, note, timestamp, rework_cycle)
       VALUES ?`,
      [values]
    );

    res.json({ success: true, message: "Khởi tạo tracking thành công" });
  } catch (err) {
    console.error("Lỗi khởi tạo tracking:", err);
    res.status(500).json({ success: false, message: "Lỗi khởi tạo tracking" });
  }
};

// Hàm query helper
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}
