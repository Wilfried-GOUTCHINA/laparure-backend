const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  image_principale: { type: String },
  reduction: { type: Number, default: 5 },
  bijoux: [{
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    type: { type: String },
    image: { type: String },
    disponible: { type: Boolean, default: true }
  }],
  disponible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
