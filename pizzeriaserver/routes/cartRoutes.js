const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

// Add item
router.post("/", async (req, res) => {
  const item = new Cart(req.body);
  await item.save();
  res.json({ message: "Item added to cart" });
});

// Update quantity
router.put("/:id", async (req, res) => {
  await Cart.findByIdAndUpdate(req.params.id, {
    quantity: req.body.quantity
  });
  res.json({ message: "Quantity updated" });
});

// Delete item
router.delete("/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

// Fetch cart items
router.get("/", async (req, res) => {
  const items = await Cart.find();
  res.json(items);
});

module.exports = router;
