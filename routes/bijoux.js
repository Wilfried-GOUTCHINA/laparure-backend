const express = require('express');
const router = express.Router();
const Bijou = require('../models/Bijou');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const bijoux = await Bijou.find({ disponible: true });
    res.json(bijoux);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const bijou = new Bijou({
      ...req.body,
      image: req.file ? '/uploads/' + req.file.filename : null
    });
    await bijou.save();
    res.status(201).json(bijou);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = '/uploads/' + req.file.filename;
    const bijou = await Bijou.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(bijou);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Bijou.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bijou supprime' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
