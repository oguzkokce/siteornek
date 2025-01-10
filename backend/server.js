const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const guideRoutes = require("./routes/guideRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express(); // `app` burada tanımlandı

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/reservations", reservationRoutes);

// API Rotaları
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/guides", guideRoutes);

// Basit bir rota
app.get("/", (req, res) => {
  res.send("Backend çalışıyor!");
});

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı!");
    app.listen(5000, () => console.log("Server 5000 portunda çalışıyor."));
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
  });
