const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Schedule = require('../models/Schedule');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.m4a';
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Create a new voice message schedule
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { elderId, title, scheduledTime, type } = req.body;

    if (!elderId || !title || !scheduledTime || !req.file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const timeDate = new Date(scheduledTime);
    const hours = String(timeDate.getHours()).padStart(2, '0');
    const minutes = String(timeDate.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const newSchedule = new Schedule({
      elderId,
      title,
      audioFileName: req.file.filename,
      scheduledTime: timeString,
      type: type === 'emergency' ? 'emergency' : 'reminder',
    });

    await newSchedule.save();

    res.status(201).json({ message: 'Voice message scheduled successfully', schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all schedules for a specific elder (used by mobile app)
router.get('/elder/:elderId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ elderId: req.params.elderId, isActive: true });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;