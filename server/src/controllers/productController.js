const Product = require("../models/Product");
const Shop = require("../models/Shop");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      shopId,
    } = req.body;

    // Verify shop belongs to logged-in user
    const shop = await Shop.findOne({
      _id: shopId,
      owner: req.user._id,
    });

    if (!shop) {
      return res.status(403).json({
        message: "You can only add products to your own shops",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      shop: shopId,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({
      shop: req.params.shopId,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const q = req.query.q;

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProductsByShop,
  searchProducts,
};