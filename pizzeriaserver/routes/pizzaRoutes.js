const express = require("express");
const Pizza = require("../models/Pizza");
const router = express.Router();

router.get("/", async (req, res) => {
  const pizzas = await Pizza.find();
  res.json(pizzas);
});

module.exports = router;
