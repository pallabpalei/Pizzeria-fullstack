const express = require("express");
const Ingredient = require("../models/Ingredient");
const router = express.Router();

router.get("/", async (req, res) => {
  const ingredients = await Ingredient.find();
  res.json(ingredients);
});

module.exports = router;
