const path = require('path');
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const guardianRoutes = require("./routes/guardianRoutes");
const elderRoutes = require("./routes/elderRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const syncRoutes = require('./routes/syncRoutes');
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("ElderCare backend is running 🚀");
});
app.use("/api/guardians", guardianRoutes);
app.use("/api/elders", elderRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use('/api/sync', syncRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
