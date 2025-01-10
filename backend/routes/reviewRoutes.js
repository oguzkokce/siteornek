const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");

// Yorum ekleme
router.post("/", authMiddleware, async (req, res) => {
  const { guideId, rating, comment } = req.body;

  try {
    const review = new Review({
      guideId,
      userId: req.user.id, // JWT'den gelen kullanıcı ID'si
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error("Yorum eklerken hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Rehber için yorumları listeleme
router.get("/:guideId", async (req, res) => {
  try {
    const reviews = await Review.find({ guideId: req.params.guideId }).populate(
      "userId",
      "username"
    );
    res.json(reviews);
  } catch (error) {
    console.error("Yorumları listelerken hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

module.exports = router;
