const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/product-image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "smartkart-products",
        }
      );

      res.json({
        imageUrl: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;