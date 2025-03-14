const express = require('express');
const router = express.Router();
// For simplicity, alerts can be stored in memory or added to a table if needed.
// Here, we use an in-memory array as a simple example.
let alerts = [];

// POST /alerts - Create a new alert
router.post('/', (req, res) => {
  const { user_id, asset_id, price_threshold, alert_type } = req.body;
  const newAlert = { id: alerts.length + 1, user_id, asset_id, price_threshold, alert_type, created_at: new Date() };
  alerts.push(newAlert);
  res.status(201).json(newAlert);
});

// GET /alerts - Get alerts for a user (optional filtering)
router.get('/', (req, res) => {
  const { user_id } = req.query;
  if (user_id) {
    res.json(alerts.filter(alert => alert.user_id == user_id));
  } else {
    res.json(alerts);
  }
});

module.exports = router;