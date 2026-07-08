const mongoose = require('mongoose');

const elderSchema = new mongoose.Schema({
  guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian', required: true },
  elderName: { type: String, required: true },
  elderAge: { type: Number, required: true },
  caretakerName: { type: String, required: true },
  caretakerPhone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Elder', elderSchema);