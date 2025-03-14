const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Transaction = require('../models/Transaction');

// Existing POST endpoint remains...

// GET /transactions with optional query parameters: user_id, asset_id, type, start, end
router.get('/', async (req, res) => {
  const { user_id, asset_id, type, start, end } = req.query;
  let whereClause = '';
  let replacements = {};

  if (user_id) {
    whereClause += ` WHERE user_id = :user_id `;
    replacements.user_id = user_id;
  }
  if (asset_id) {
    whereClause += (whereClause ? ' AND ' : ' WHERE ') + ` asset_id = :asset_id `;
    replacements.asset_id = asset_id;
  }
  if (type) {
    whereClause += (whereClause ? ' AND ' : ' WHERE ') + ` type = :type `;
    replacements.type = type;
  }
  if (start && end) {
    whereClause += (whereClause ? ' AND ' : ' WHERE ') + ` timestamp BETWEEN :start AND :end `;
    replacements.start = start;
    replacements.end = end;
  }

  try {
    const transactions = await sequelize.query(`
      SELECT * FROM transactions
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT 1000
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      useMaster: true,
    });
    res.json(transactions);
  } catch (error) {
    console.error('Transaction retrieval error:', error);
    res.status(500).json({ error: 'Unable to fetch transactions.' });
  }
});

module.exports = router;