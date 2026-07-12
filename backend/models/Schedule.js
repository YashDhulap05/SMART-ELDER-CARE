const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Elder', required: true },
  title: { type: String, required: true },
  audioFileName: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  type: { type: String, enum: ['reminder', 'emergency'], default: 'reminder' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);