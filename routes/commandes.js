const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const commande = new Commande(req.body);
    await commande.save();
    res.status(201).json({ message: 'Commande enregistree !', commande });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const commandes = await Commande.find().populate('bijoux.bijou').sort({ createdAt: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/statut', auth, async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    );
    res.json(commande);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande supprimee' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
