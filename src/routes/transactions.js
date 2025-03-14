const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Transaction = require('../models/Transaction');

router.post('/', async (req, res) => {
  const { user_id, asset_id, quantity } = req.body;

  const t = await sequelize.transaction();
  try {
    const transaction = await Transaction.create({ user_id, asset_id, type: "BUY", quantity, price: 1000 }, { transaction: t });
    await t.commit();
    res.json(transaction);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Transaction failed' });
  }
});

module.exports = router;