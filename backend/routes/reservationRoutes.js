const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const authMiddleware = require("../middleware/authMiddleware");

// Rezervasyon oluştur
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { guideId, date } = req.body;

    if (!guideId || !date) {
      return res.status(400).json({ error: "Gerekli bilgiler eksik." });
    }

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
