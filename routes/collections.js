const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'laparure/collections' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({ disponible: true });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection non trouvée' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.fields([
  { name: 'image_principale', maxCount: 1 },
  { name: 'bijoux_images', maxCount: 10 }
]), async (req, res) => {
  try {
    let image_principale = null;
    if (req.files?.image_principale) {
      image_principale = await uploadToCloudinary(req.files.image_principale[0].buffer);
    }

    const bijoux = JSON.parse(req.body.bijoux || '[]');

    if (req.files?.bijoux_images) {
      for (let i = 0; i < req.files.bijoux_images.length; i++) {
        if (bijoux[i]) {
          bijoux[i].image = await uploadToCloudinary(req.files.bijoux_images[i].buffer);
        }
      }
    }

    const collection = new Collection({
      nom: req.body.nom,
      description: req.body.description,
      reduction: req.body.reduction || 5,
      image_principale,
      bijoux
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', auth, upload.fields([
  { name: 'image_principale', maxCount: 1 },
  { name: 'bijoux_images', maxCount: 10 }
]), async (req, res) => {
  try {
    const update = {
      nom: req.body.nom,
      description: req.body.description,
      reduction: req.body.reduction
    };

    if (req.files?.image_principale) {
      update.image_principale = await uploadToCloudinary(req.files.image_principale[0].buffer);
    }

    if (req.body.bijoux) {
      const bijoux = JSON.parse(req.body.bijoux);
      if (req.files?.bijoux_images) {
        for (let i = 0; i < req.files.bijoux_images.length; i++) {
          if (bijoux[i]) {
            bijoux[i].image = await uploadToCloudinary(req.files.bijoux_images[i].buffer);
          }
        }
      }
      update.bijoux = bijoux;
    }

    const collection = await Collection.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(collection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
