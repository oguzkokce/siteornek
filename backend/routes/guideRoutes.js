const express = require("express");
const Guide = require("../models/Guide");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, location, description, price } = req.body;
    const newGuide = new Guide({ name, location, description, price });
    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    console.error("Rehber ekleme hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});
// Rehber listeleme ve arama
router.get("/", async (req, res) => {
  try {
    const { location, name } = req.query;
    const filters = {};

    if (location) filters.location = new RegExp(location, "i");
    if (name) filters.name = new RegExp(name, "i");

    const guides = await Guide.find(filters);
    res.json(guides);
  } catch (error) {
    console.error("Rehber listeleme hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id); // Rehber ID'sine göre rehberi bulun
    if (!guide) {
      return res.status(404).json({ error: "Rehber bulunamadı." });
    }
    res.json(guide);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Rehber detayını çekerken bir hata oluştu." });
  }
});

module.exports = router;
