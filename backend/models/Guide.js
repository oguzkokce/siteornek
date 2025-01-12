const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number], // Array of numbers
      required: true,
    },
  },
});

module.exports = mongoose.model("Guide", guideSchema);
