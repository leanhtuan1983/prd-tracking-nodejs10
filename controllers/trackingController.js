const db = require("../models/db");

// Hàm dùng chung
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve([results]);
    });
  });
}

exports.index = (req, res) => {
  res.render("tracking/index");
};

exports.trackingList = async (req, res) => {
  try {
    const [results] = await query(`
    SELECT 
      t.lot_id,
      l.lot_code,
      p.name AS product_name,
      c.name AS category_name,
      prd.name AS procedure_name,
      t.rework_cycle,
      t.created_at
    FROM product_process_tracking t
    JOIN (
      SELECT lot_id, rework_cycle, MIN(id) AS min_id
      FROM product_process_tracking
      GROUP BY lot_id, rework_cycle
      ) first_step ON t.id = first_step.min_id
    JOIN lots l ON t.lot_id = l.id
    JOIN products p ON t.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN processes prc ON t.process_id = prc.id
    JOIN procedures prd ON prc.procedure_id = prd.id
    ORDER BY t.created_at DESC;
  `);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi truy vấn danh sách" });
  }
};

exports.detailPage = async (req, res) => {
  const { lot_code, cycle } = req.params;
  try {
    const [[lot]] = await query(
      `
      SELECT l.id, p.name FROM lots l
      INNER JOIN products p ON l.product_id = p.id
      WHERE l.lot_code = ?
    `,
      [lot_code]
    );

    if (!lot) return res.status(404).send("Lot không tồn tại");

    res.render("tracking/detail", {
      lot_id: lot.id,
      lot_code,
      rework_cycle: cycle,
      product_name: lot.name,
    });
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
};

exports.showDetail = async (req, res) => {
  const { lot_code, cycle } = req.params;
  try {
    const [[lot]] = await query("SELECT id FROM lots WHERE lot_code = ?", [
      lot_code,
    ]);
    if (!lot)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lot" });

    const [results] = await query(
      `
      SELECT prc.name AS process_name, prc.department_id, d.name AS department_name, track.status, track.timestamp, track.note
      FROM product_process_tracking track
      INNER JOIN processes prc ON track.process_id = prc.id
      INNER JOIN departments d ON prc.department_id = d.id
      WHERE track.lot_id = ? AND track.rework_cycle = ?
      ORDER BY prc.process_order ASC`,
      [lot.id, cycle]
    );

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi truy vấn chi tiết" });
  }
};

exports.updateStatus = async (req, res) => {
  const { lot_code, process_name, rework_cycle } = req.body;
  const user_id =
    req.session && req.session.user && req.session.user.id
      ? req.session.user.id
      : 0;
  const timestamp = new Date();

  try {
    const [[lot]] = await query("SELECT id FROM lots WHERE lot_code = ?", [
      lot_code,
    ]);
    if (!lot)
      return res
        .status(404)
        .json({ success: false, message: "Lot không tồn tại" });

    const [[proc]] = await query("SELECT id FROM processes WHERE name = ?", [
      process_name,
    ]);
    if (!proc)
      return res
        .status(404)
        .json({ success: false, message: "Process không tồn tại" });

    const lot_id = lot.id;
    const process_id = proc.id;

    const [[track]] = await query(
      `
      SELECT id, status FROM product_process_tracking
      WHERE lot_id = ? AND process_id = ? AND rework_cycle = ?
    `,
      [lot_id, process_id, rework_cycle]
    );

    if (!track)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy process" });

    let newStatus;
    switch (track.status) {
      case "pending":
        newStatus = "processing";
        break;
      case "processing":
        newStatus = "completed";
        break;
      case "completed":
        return res.json({
          success: false,
          message: "Đã hoàn tất, không thể cập nhật",
        });
      default:
        newStatus = "pending";
    }

    await query(
      `
      UPDATE product_process_tracking
      SET status = ?, user_id = ?, timestamp = ?
      WHERE lot_id = ? AND process_id = ? AND rework_cycle = ?
    `,
      [newStatus, user_id, timestamp, lot_id, process_id, rework_cycle]
    );

    await query(
      `
      INSERT INTO process_tracking_logs (tracking_id, user_id, old_status, new_status, note)
      VALUES (?, ?, ?, ?, ?)
    `,
      [track.id, user_id, track.status, newStatus, "Cập nhật tiến độ"]
    );

    res.json({ success: true, message: `Cập nhật thành: ${newStatus}` });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật trạng thái" });
  }
};
