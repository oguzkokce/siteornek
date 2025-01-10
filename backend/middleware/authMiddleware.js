const jwt = require("jsonwebtoken");

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

module.exports = authMiddleware;
