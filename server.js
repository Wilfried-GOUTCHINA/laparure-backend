const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bijoux', require('./routes/bijoux'));
app.use('/api/commandes', require('./routes/commandes'));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connecte !'))
  .catch(err => console.error('Erreur MongoDB:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Serveur demarre sur le port ' + PORT));
