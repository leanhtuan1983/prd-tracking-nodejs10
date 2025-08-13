const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const {
  isAuthenticated,
  requireRole,
} = require("../middlewares/roleMiddleware");

router.use(isAuthenticated);

router.get("/", isAuthenticated, dashboardController.showDashboard);

router.get("/total", isAuthenticated, dashboardController.totalDashboard);

router.get(
  "/departmentLink",
  isAuthenticated,
  dashboardController.departmentLink
);

router.get("/:id", isAuthenticated, dashboardController.showDepartment);

router.get(
  "/:id/details",
  isAuthenticated,
  dashboardController.showDepartmentDetail
);

module.exports = router;
