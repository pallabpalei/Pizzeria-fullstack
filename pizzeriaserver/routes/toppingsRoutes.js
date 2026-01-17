const express = require("express");
const router = express.Router();
const Topping = require("../models/Toppings");

// GET all toppings
router.get("/", async (req, res) => {
  try {
    const toppings = await Topping.find();
    res.json(toppings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
