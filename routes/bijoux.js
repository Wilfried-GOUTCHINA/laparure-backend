const express = require('express');
const router = express.Router();
const Bijou = require('../models/Bijou');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'laparure',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
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
      image: req.file ? req.file.path : null
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
    if (req.file) update.image = req.file.path;
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
