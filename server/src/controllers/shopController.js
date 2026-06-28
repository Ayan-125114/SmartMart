const Shop = require("../models/Shop");

const createShop = async (req, res) => {
  try {
    const { shopName, address, longitude, latitude } = req.body;

    const shop = await Shop.create({
      shopName,
      address,
      owner: req.user._id,

      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyShops = async (req, res) => {
  try {
    const shops = await Shop.find({
      owner: req.user._id,
    });

    res.json(shops);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const radius = Number(req.query.radius) || 5000;

    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      // Fallback: If browser geolocation is denied or disabled, return all shops
      const shops = await Shop.find({});
      return res.json(shops);
    }

    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius,
        },
      },
    });

    res.json(shops);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createShop, getMyShops, getNearbyShops, getShopById };