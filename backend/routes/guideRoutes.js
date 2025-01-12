const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Guide = require("../models/Guide");
const Reservation = require("../models/Reservation");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Rehber Kaydı
router.post("/register", async (req, res) => {
  try {
    console.log("Gelen veri:", req.body);
    const { name, email, password, description, price, location } = req.body;

    // Gelen location bilgisini kontrol et
    if (
      !location ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res
        .status(400)
        .json({ error: "Geçerli bir konum bilgisi gereklidir." });
    }

    // Rehber zaten kayıtlı mı?
    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) {
      return res.status(400).json({ error: "Bu e-posta zaten kullanılıyor." });
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni rehberi kaydet
    const guide = new Guide({
      name,
      email,
      password: hashedPassword,
      description,
      price,
      location,
    });

    await guide.save();

    res.status(201).json({ message: "Rehber başarıyla kaydedildi.", guide });
  } catch (error) {
    console.error("Rehber kaydı sırasında hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Gelen veri:", req.body); // Gelen POST verisini kontrol et
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email ve şifre gereklidir." });
    }

    const guide = await Guide.findOne({ email });
    if (!guide) {
      return res.status(404).json({ error: "Rehber bulunamadı." });
    }

    const isMatch = await bcrypt.compare(password, guide.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Şifre yanlış." });
    }

    const token = jwt.sign(
      { id: guide._id, role: "guide" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Rehber girişi sırasında hata:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Rehbere ait rezervasyonları listele
router.get("/reservations", authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      guide: req.user.id,
    }).populate("user", "email");
    res.json(reservations);
  } catch (error) {
    console.error("Rehberin rezervasyonları alınırken hata oluştu:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Rehber rezervasyon durumunu günceller
router.put("/reservations/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Geçersiz durum." });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Rezervasyon bulunamadı." });
    }

    res.json({
      message: "Rezervasyon durumu başarıyla güncellendi.",
      reservation,
    });
  } catch (error) {
    console.error("Rezervasyon güncellenirken hata oluştu:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

router.get("/", async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json(guides);
  } catch (error) {
    console.error("Rehberleri çekerken hata:", error);
    res.status(500).json({ error: "Rehberler alınamadı." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: "Rehber bulunamadı." });
    }
    res.status(200).json(guide);
  } catch (error) {
    console.error("Rehber detayını çekerken hata oluştu:", error);
    res.status(500).json({ error: "Rehber detayını alırken bir hata oluştu." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, minPrice, maxPrice, location } = req.query;

    // Filtreleme kriterlerini oluştur
    let filter = {};

    // Arama (isim veya açıklama)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Fiyat aralığı
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Lokasyon filtresi (örneğin: belirli bir şehir için)
    if (location) {
      filter["location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [[location.lng, location.lat], 50 / 6378.1],
        },
      }; // 50 km'lik bir yarıçap için
    }

    // Filtrelenmiş rehberleri getir
    const guides = await Guide.find(filter);
    res.json(guides);
  } catch (error) {
    console.error("Rehberleri getirirken hata:", error);
    res.status(500).json({ error: "Rehberler alınırken bir hata oluştu." });
  }
});

module.exports = router;
