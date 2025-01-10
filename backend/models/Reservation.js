const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide", required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Reservation", reservationSchema);
