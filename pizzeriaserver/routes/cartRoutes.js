const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Add item to cart (user specific)
router.post("/", auth, async (req, res) => {
  try {
    const item = new Cart({
      ...req.body,
      userId: req.userId
    });

    await item.save();
    res.json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update cart item (only for that user)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete cart item (only for that user)
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Fetch cart items (only for that user)
router.get("/", auth, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
