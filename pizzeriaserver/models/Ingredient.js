const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  id: Number,
  tname: String,
  price: Number,
  image: String
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
