require('dotenv').config();
const express = require('express');
const cors = require('cors');
const assetRoutes = require('./routes/assetRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assets', assetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
