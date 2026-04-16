require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predictions', require('./routes/predictions'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
