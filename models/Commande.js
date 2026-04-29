const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: {
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String }
  },
  bijoux: [{
    bijou: { type: mongoose.Schema.Types.ObjectId, ref: 'Bijou' },
    nom: String,
    prix: Number,
    quantite: { type: Number, default: 1 }
  }],
  total: { type: Number, required: true },
  paiement: { type: String, enum: ['mtn', 'moov', 'whatsapp'], required: true },
  statut: { type: String, enum: ['en_attente', 'confirme', 'livre', 'annule'], default: 'en_attente' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Commande', commandeSchema);
