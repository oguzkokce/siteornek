const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
});
module.exports = mongoose.model("Guide", guideSchema);
