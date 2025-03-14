const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// GET /market-data 
router.get('/', async (req, res) => {
  try {
    // Querying the materialized view created in Phase 3 (daily_market_summary)
    const data = await sequelize.query(`
      SELECT *
      FROM daily_market_summary
      ORDER BY day DESC
      LIMIT 100
    `, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(data);
  } catch (error) {
    console.error('Market analytics error:', error);
    res.status(500).json({ error: 'Unable to fetch market analytics.' });
  }
});

module.exports = router;