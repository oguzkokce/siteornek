const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// JWT doğrulama middleware

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token'ı al
  if (!token) {
    return res.status(401).json({ error: "Yetkisiz erişim. Token eksik." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // .env'deki secret kullan
    req.user = decoded; // JWT'deki kullanıcı bilgilerini req.user'a at
    next();
  } catch (error) {
    console.error("JWT doğrulama hatası:", error);
    res.status(401).json({ error: "Token geçersiz." });
  }
};

// Kullanıcı bilgilerini alma
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // JWT'den alınan kullanıcı ID'si
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json(user);
  } catch (error) {
    console.error("GET /me hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Şifre değiştirme
router.put("/password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Eski şifre hatalı." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Şifre güncellendi!" });
  } catch (error) {
    console.error("PUT /password hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Profil bilgileri güncelleme
router.put("/profile", authMiddleware, async (req, res) => {
  const { username, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // JWT'den alınan kullanıcı ID'si
      { username, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("PUT /profile hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Kullanıcı Kayıt
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Bu e-posta zaten kayıtlı!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (error) {
    console.error("POST /register hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

// Kullanıcı Girişi
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Geçersiz şifre!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // .env'deki secret kullan

    res.json({ token });
  } catch (error) {
    console.error("POST /login hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

// Çıkış
router.post("/logout", (req, res) => {
  res.json({ message: "Çıkış yapıldı!" });
});

module.exports = router;
