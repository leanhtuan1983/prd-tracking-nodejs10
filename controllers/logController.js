const db = require("../models/db");
const ExcelJS = require("exceljs");

// Hàm query chung
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}

exports.index = (req, res) => {
  res.render("logs/index");
};

exports.list = async (req, res) => {
  try {
    const { from, to, lot_code, product_name } = req.query;

    let conditions = [];
    let values = [];

    if (from) {
      conditions.push("ptl.timestamp >= ?");
      values.push(from + " 00:00:00");
    }
    if (to) {
      conditions.push("ptl.timestamp <= ?");
      values.push(to + " 23:59:59");
    }
    if (lot_code) {
      conditions.push("l.lot_code LIKE ?");
      values.push(`%${lot_code}%`);
    }
    if (product_name) {
      conditions.push("p.name LIKE ?");
      values.push(`%${product_name}%`);
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const [results] = await query(
      `
      SELECT ptl.tracking_id, l.lot_code, p.name AS product_name,
             prc.name AS process_name, u.username, ptl.old_status,
             ptl.new_status, ptl.timestamp, ptl.note, ppt.rework_cycle
      FROM process_tracking_logs ptl
      INNER JOIN product_process_tracking ppt ON ptl.tracking_id = ppt.id
      INNER JOIN lots l ON ppt.lot_id = l.id
      INNER JOIN products p ON ppt.product_id = p.id
      INNER JOIN processes prc ON ppt.process_id = prc.id
      LEFT JOIN users u ON ptl.user_id = u.id
      ${whereClause}
      ORDER BY ptl.timestamp DESC
      `,
      values
    );

    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Lỗi truy vấn logs:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const { from, to, lot_code, product_name } = req.query;

    let conditions = [];
    let values = [];

    if (from) {
      conditions.push("ptl.timestamp >= ?");
      values.push(from + " 00:00:00");
    }
    if (to) {
      conditions.push("ptl.timestamp <= ?");
      values.push(to + " 23:59:59");
    }
    if (lot_code) {
      conditions.push("l.lot_code LIKE ?");
      values.push(`%${lot_code}%`);
    }
    if (product_name) {
      conditions.push("p.name LIKE ?");
      values.push(`%${product_name}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [results] = await query(
      `
      SELECT 
        l.lot_code, p.name AS product_name, prc.name AS process_name,
        ptl.old_status, ptl.new_status, ptl.timestamp,
        u.username, ptl.note, ppt.rework_cycle
      FROM process_tracking_logs ptl
      INNER JOIN product_process_tracking ppt ON ptl.tracking_id = ppt.id
      INNER JOIN lots l ON ppt.lot_id = l.id
      INNER JOIN products p ON ppt.product_id = p.id
      INNER JOIN processes prc ON ppt.process_id = prc.id
      LEFT JOIN users u ON ptl.user_id = u.id
      ${whereClause}
      ORDER BY ptl.timestamp DESC
      `,
      values
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Logs");

    // Header
    worksheet.columns = [
      { header: "Mã lô", key: "lot_code", width: 15 },
      { header: "Sản phẩm", key: "product_name", width: 20 },
      { header: "Quy trình", key: "process_name", width: 20 },
      { header: "Trạng thái cũ", key: "old_status", width: 15 },
      { header: "Trạng thái mới", key: "new_status", width: 15 },
      { header: "Thời gian", key: "timestamp", width: 20 },
      { header: "Người cập nhật", key: "username", width: 20 },
      { header: "Ghi chú", key: "note", width: 30 },
      { header: "Chu kỳ", key: "rework_cycle", width: 10 },
    ];

    // Data
    results.forEach((row) => {
      worksheet.addRow({
        ...row,
        timestamp: new Date(row.timestamp).toLocaleString("vi-VN"),
      });
    });

    // Xuất file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=log_export.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Lỗi export Excel:", err);
    res.status(500).json({ success: false, message: "Lỗi xuất Excel" });
  }
};
