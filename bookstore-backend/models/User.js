const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

module.exports = mongoose.model("User", userSchema);
