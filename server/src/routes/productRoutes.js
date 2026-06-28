const express = require("express");
const router = express.Router();

const { createProduct , getProductsByShop , searchProducts} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProduct);
router.get("/shop/:shopId", getProductsByShop);
router.get("/search", searchProducts);

module.exports = router;