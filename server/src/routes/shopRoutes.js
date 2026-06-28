const express = require("express");
const router = express.Router();

const { createShop , getMyShops , getNearbyShops, getShopById } = require("../controllers/shopController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createShop);
router.get("/my-shops", protect, getMyShops);
router.get("/nearby", getNearbyShops);
router.get("/:id", getShopById);

module.exports = router;