const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
 

  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 

    itemId: { type: String, required: true },
    name: { type: String, required: true },

    type: { type: String }, // veg / nonveg / custom etc

    // ✅ Pricing fields
    basePrice: { type: Number, default: 0 },
    extraToppingCost: { type: Number, default: 0 },
    price: { type: Number, required: true },

    quantity: { type: Number, default: 1 },

    // ✅ Customization flags
    isCustom: { type: Boolean, default: false },

    // ✅ Used for Order Pizza customization (TOPPINGS ONLY)
    selectedToppings: { type: [String], default: [] },

    // ✅ Used for Build Ur Pizza (INGREDIENTS)
    selectedIngredients: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
