-- Index for transactions to improve user-specific queries
CREATE INDEX idx_transactions_user_asset ON transactions(user_id, asset_id);

-- BRIN index for efficient time-range queries on transactions
CREATE INDEX idx_transactions_timestamp ON transactions USING BRIN(timestamp);

-- Composite index on portfolio for fast lookups
CREATE INDEX idx_portfolio_user ON portfolio(user_id);

-- Covering index on assets for price analytics
CREATE INDEX idx_assets_price ON assets(current_price);