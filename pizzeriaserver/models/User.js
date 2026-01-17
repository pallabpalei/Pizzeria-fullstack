const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    mobile: {
      type: String, // ✅ keep it string (best practice)
      required: true,
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Mobile must be 10 digits"]
    },

    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
