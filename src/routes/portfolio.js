const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/:user_id', async (req, res) => {
  const numericUserId = parseInt(req.params.user_id, 10);
  if (isNaN(numericUserId)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  try {
    const portfolio = await sequelize.query(`
      SELECT p.asset_id,
        p.quantity,
        p.avg_price,
        a.current_price,
        (p.quantity * a.current_price) AS current_value
      FROM portfolio p
      JOIN assets a ON p.asset_id = a.asset_id
      WHERE p.user_id = :user_id
    `, {
      replacements: { user_id: numericUserId },
      type: sequelize.QueryTypes.SELECT,
      useMaster: true,
    });
    res.json(portfolio);
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ error: 'Unable to fetch portfolio.' });
  }
});

module.exports = router;