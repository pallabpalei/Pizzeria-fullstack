require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const toppingRoutes = require("./routes/toppingsRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/pizzas", require("./routes/pizzaRoutes"));
app.use("/api/ingredients", require("./routes/ingredientRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/toppings", toppingRoutes);
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
