const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@laparure.com' && password === 'LaParure2026!') {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, message: 'Connexion reussie' });
  }
  return res.status(401).json({ message: 'Identifiants incorrects' });
});

module.exports = router;
