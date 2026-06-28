const express = require("express");
const router = express.Router();

const { placeOrder , getMyOrders} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);

module.exports = router;