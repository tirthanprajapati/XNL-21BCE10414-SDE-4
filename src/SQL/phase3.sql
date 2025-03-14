-- Real-time portfolio value for a specific user (e.g. user_id 123)
SELECT 
  p.asset_id,
  SUM(p.quantity * a.current_price) AS current_value
FROM portfolio p
JOIN assets a USING (asset_id)
WHERE p.user_id = 123
GROUP BY p.asset_id;

-- Time-series analytics: Aggregated volume per asset per one-hour bucket (last 24 hours)
SELECT 
  time_bucket('1 hour'::interval, timestamp::timestamptz) AS bucket,
  asset_id,
  SUM(quantity) AS volume
FROM transactions
WHERE timestamp > NOW() - INTERVAL '24 hour'
GROUP BY bucket, asset_id;

-- Materialized view for daily market summaries
CREATE MATERIALIZED VIEW daily_market_summary AS
SELECT 
  time_bucket('1 day'::interval, timestamp::timestamptz) AS day,
  asset_id,
  SUM(quantity) AS total_volume,
  AVG(price) AS avg_price
FROM transactions
GROUP BY day, asset_id;

-- Refresh the materialized view periodically (e.g., via a cron job)
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_market_summary;

-- Compound index on transactions to accelerate user, asset, and time-based queries
CREATE INDEX IF NOT EXISTS idx_transactions_compound 
ON transactions(user_id, asset_id, timestamp);

-- BRIN index on assets current price for efficient price-based analytics
CREATE INDEX IF NOT EXISTS idx_assets_price 
ON assets USING BRIN(current_price);