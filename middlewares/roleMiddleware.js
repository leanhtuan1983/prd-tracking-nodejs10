// middlewares/roleMiddleware.js
const db = require("../models/db");

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}
// Kiểm tra login
exports.isAuthenticated = function (req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/auth/login");
};

// Kiểm tra quyền truy cập
exports.checkRoles = function (...roles) {
  return function (req, res, next) {
    if (
      req.session &&
      req.session.user &&
      roles.includes(req.session.user.role)
    ) {
      return next();
    }
    return res.status(403).send("Không có quyền truy cập!");
  };
};

// Kiểm tra quyền thao tác đối với các processes trong department tương ứng
// middlewares/roleMiddleware.js
exports.checkDepartmentPermission = function (location = "params", key = "id") {
  return async function (req, res, next) {
    try {
      // Admin bypass tất cả
      const userRole = req.session.user.role;
      if (userRole === "admin") {
        return next();
      }
      // Không phải là Admin thì kiểm tra phòng ban
      const userId = req.session.user.id;
      let departmentId;
      if (location === "params") departmentId = req.params[key];
      else if (location === "body") departmentId = req.body[key];
      else if (location === "query") departmentId = req.query[key];
      else
        return res
          .status(400)
          .json({ success: false, message: "Vị trí không hợp lệ" });

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          message: "Không có department_id để kiểm tra quyền",
        });
      }

      const results = await query(
        "SELECT 1 FROM user_department_permissions WHERE user_id = ? AND department_id = ? LIMIT 1",
        [userId, departmentId]
      );

      if (results.length > 0) {
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập vào bộ phận này!",
        });
      }
    } catch (err) {
      console.error("Lỗi kiểm tra quyền phòng ban:", err);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  };
};
