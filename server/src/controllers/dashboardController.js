const Product = require("../models/Product");
const Shop = require("../models/Shop");
const Order = require("../models/Order");

const sellerDashboard = async (req, res) => {
  try {
    const shops = await Shop.find({
      owner: req.user._id,
    });

    const shopIds = shops.map((shop) => shop._id);

    const totalProducts = await Product.countDocuments({
      shop: { $in: shopIds },
    });

    const products = await Product.find({
      shop: { $in: shopIds },
    });
    const productIds = products.map((product) => product._id.toString());

    const orders = await Order.find({
      "items.product": { $in: productIds },
    }).populate("items.product").populate("user", "name email");

    let sellerRevenue = 0;
    let sellerOrderCount = 0;
    const sellerOrdersList = [];

    for (const order of orders) {
      let containsSellerProduct = false;
      let orderRevenueForSeller = 0;
      const sellerItems = [];

      for (const item of order.items) {
        if (item.product && productIds.includes(item.product._id.toString())) {
          containsSellerProduct = true;
          orderRevenueForSeller += item.product.price * item.quantity;
          sellerItems.push({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
          });
        }
      }

      if (containsSellerProduct) {
        sellerOrderCount++;
        sellerRevenue += orderRevenueForSeller;
        sellerOrdersList.push({
          _id: order._id,
          user: order.user,
          items: sellerItems,
          totalAmount: orderRevenueForSeller,
          status: order.status,
          createdAt: order.createdAt,
        });
      }
    }

    res.json({
      totalShops: shops.length,
      totalProducts,
      totalOrders: sellerOrderCount,
      totalRevenue: sellerRevenue,
      orders: sellerOrdersList,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sellerDashboard,
};