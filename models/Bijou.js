const mongoose = require('mongoose');

const bijouSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  categorie: { type: String, enum: ['colliers', 'bagues', 'bracelets', 'boucles', 'parures'], required: true },
  image: { type: String },
  disponible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Bijou', bijouSchema);
