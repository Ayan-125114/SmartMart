const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let item = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (item) {
      item.quantity += quantity;
      await item.save();

      return res.json(item);
    }

    item = await Cart.create({
      user: req.user._id,
      product: productId,
      quantity,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
};