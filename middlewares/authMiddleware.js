// middleware authMiddleware.js
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/auth/login");
};

exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    res.status(403).send("Không có quyền truy cập!");
  };
};
