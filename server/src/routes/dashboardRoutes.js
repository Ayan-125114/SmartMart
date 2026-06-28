const express = require("express");
const router = express.Router();

const { sellerDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, sellerDashboard);

module.exports = router;