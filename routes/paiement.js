const express = require('express');
const router = express.Router();
const { FedaPay, Transaction } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(process.env.FEDAPAY_ENV || 'sandbox');

router.post('/initier', async (req, res) => {
  try {
    const { montant, nom, email, telephone, bijoux } = req.body;

    const transaction = await Transaction.create({
      description: 'Commande La Parure',
      amount: montant,
      currency: { iso: 'XOF' },
      callback_url: `${process.env.BASE_URL}/api/paiement/callback`,
      customer: {
        firstname: nom,
        lastname: '',
        email: email || 'client@laparure.com',
        phone_number: {
          number: telephone,
          country: 'BJ'
        }
      }
    });

    const token = await transaction.generateToken();
    res.json({ token: token.token, transaction_id: transaction.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur paiement', error: err.message });
  }
});

router.post('/callback', async (req, res) => {
  try {
    const { id } = req.body;
    const transaction = await Transaction.retrieve(id);

    if (transaction.status === 'approved') {
      console.log('Paiement approuvé:', transaction.id);
    }

    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
