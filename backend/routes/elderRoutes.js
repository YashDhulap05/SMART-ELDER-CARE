const express = require('express');
const router = express.Router();
const Elder = require('../models/Elder');

// Create a new elder profile
router.post('/', async (req, res) => {
  try {
    const { guardianId, elderName, elderAge, caretakerName, caretakerPhone } = req.body;

    if (!guardianId || !elderName || !elderAge || !caretakerName || !caretakerPhone) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const newElder = new Elder({ guardianId, elderName, elderAge, caretakerName, caretakerPhone });
    await newElder.save();

    res.status(201).json({ message: 'Elder profile created successfully', elder: newElder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all elder profiles for a specific guardian
router.get('/:guardianId', async (req, res) => {
  try {
    const elders = await Elder.find({ guardianId: req.params.guardianId });
    res.status(200).json(elders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;