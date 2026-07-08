require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const guardianRoutes = require('./routes/guardianRoutes');
const elderRoutes = require('./routes/elderRoutes');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('ElderCare backend is running 🚀');
});
app.use('/api/guardians', guardianRoutes);
app.use('/api/elders', elderRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});