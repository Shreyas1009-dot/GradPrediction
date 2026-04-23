require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/predictions', require('../server/routes/predictions'));

// Start server only when not in Vercel environment
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
