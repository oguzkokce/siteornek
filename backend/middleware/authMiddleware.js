const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Yetkisiz erişim. Token eksik." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User ID:", decoded.id); // Kullanıcı ID'sini logla
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT doğrulama hatası:", error);
    res.status(401).json({ error: "Geçersiz token." });
  }
};

module.exports = authMiddleware;
