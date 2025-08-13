// -----------------------------
// controllers/authController.js
// -----------------------------
const db = require("../models/db");

exports.getLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT u.id, u.username, u.role, u.department_id, d.name AS department_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.username = ? AND u.password = ?
    LIMIT 1
  `;

  db.query(query, [username, password], (err, results) => {
    if (err) return res.render("login", { error: "Lỗi truy vấn!" });

    if (results.length === 0) {
      return res.render("auth/login", { error: "Sai tài khoản hoặc mật khẩu" });
    }

    const user = results[0];
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      department_id: user.department_id,
      department_name: user.department_name,
    };

    res.redirect("/dashboard");
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
