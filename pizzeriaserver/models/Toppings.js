const mongoose = require("mongoose");

const toppingSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  tname: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Topping", toppingSchema);
