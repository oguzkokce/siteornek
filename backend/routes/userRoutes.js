const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Kullanıcı giriş
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Geçersiz şifre." });
    }

    // Token oluşturma
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated Token:", token); // Loglama ekledim

    res.json({ token });
  } catch (error) {
    console.error("POST /login hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

// Kullanıcı bilgilerini alma
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Yetkisiz erişim. Token eksik." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Loglama ekledim

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json(user);
  } catch (error) {
    console.error("GET /me hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

module.exports = router;
