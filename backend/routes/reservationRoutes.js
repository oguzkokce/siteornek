const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Guide = require("../models/Guide");
const authMiddleware = require("../middleware/authMiddleware");

// Rezervasyon oluştur
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { guideId, date } = req.body;

    // Validate guideId
    if (!mongoose.Types.ObjectId.isValid(guideId)) {
      return res.status(400).json({ error: "Geçersiz rehber ID'si." });
    }

    // Validate user ID from authMiddleware
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ error: "Geçersiz kullanıcı ID'si." });
    }

    // Check if guide exists
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ error: "Rehber bulunamadı." });
    }

    // Check for existing reservation
    const existingReservation = await Reservation.findOne({
      guide: guideId,
      date,
    });
    if (existingReservation) {
      return res
        .status(400)
        .json({ error: "Bu tarih için zaten bir rezervasyon var." });
    }

    // Create new reservation
    const reservation = new Reservation({
      user: req.user.id,
      guide: guideId,
      date,
    });

    await reservation.save();
    res.status(201).json({ message: "Rezervasyon oluşturuldu!", reservation });
  } catch (error) {
    console.error("Rezervasyon oluşturulurken hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Kullanıcının rezervasyonlarını al
router.get("/my-reservations", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate(
      "guide"
    );
    res.json(reservations);
  } catch (error) {
    console.error("Rezervasyonlar alınırken hata oluştu:", error);
    res.status(500).json({ error: "Rezervasyonlar alınamadı." });
  }
});

module.exports = router;
