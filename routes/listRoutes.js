module.exports = function (app) {
  app.use("/auth", require("./authRoutes"));
  app.use("/tracking", require("./trackingRoutes"));
  app.use("/management", require("./managementRoutes"));
  app.use("/admin", require("./adminRoutes"));
  app.use("/dashboard", require("./dashboardRoutes"));
  app.use("/permissions", require("./permissionRoutes"));
  app.use("/logs", require("./logRoutes"));
  app.use("/settings", require("./settingRoutes"));
};

// app.use("/users", require("./userRoutes"));
// app.use("/dashboard", require("./dashboardRoutes"));
// app.use("/departments", require("./departmentRoutes"));
// app.use("/categories", require("./categoryRoutes"));
// app.use("/products", require("./productRoutes"));
// app.use("/lots", require("./lotRoutes"));
// app.use("/procedures", require("./procedureRoutes"));
// app.use("/processes", require("./processRoutes"));
// app.use("/initTracking", require("./initTrackingRoutes"));
// app.use("/tracking", require("./trackingRoutes"));
// app.use("/logs", require("./logRoutes"));
