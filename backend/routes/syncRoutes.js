const express = require("express");
const router = express.Router();
const Elder = require("../models/Elder");
const Schedule = require("../models/Schedule");

// ESP32 calls this to get everything it needs in one shot
router.get("/:elderId", async (req, res) => {
  try {
    const elder = await Elder.findById(req.params.elderId);
    if (!elder) {
      return res.status(404).json({ message: "Elder not found" });
    }

    const schedules = await Schedule.find({
      elderId: req.params.elderId,
      isActive: true,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const reminders = schedules
      .filter((s) => s.type === "reminder")
      .map((s) => ({
        title: s.title,
        time: s.scheduledTime,
        audioUrl: `${baseUrl}/uploads/${s.audioFileName}`,
        audioFileName: s.audioFileName,
      }));

    const emergencySchedule = schedules.find((s) => s.type === "emergency");

    res.status(200).json({
      elderName: elder.elderName,
      caretakerName: elder.caretakerName,
      caretakerPhone: elder.caretakerPhone,
      reminders,
      emergencyAudioUrl: emergencySchedule
        ? `${baseUrl}/uploads/${emergencySchedule.audioFileName}`
        : null,
      emergencyAudioFileName: emergencySchedule
        ? emergencySchedule.audioFileName
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
