const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  price: Number,
  quantity: Number,
  type: String
});

module.exports = mongoose.model("Cart", cartSchema);
