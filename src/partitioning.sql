-- Optional: Drop partitions if they exist, to avoid errors on re-run
DROP TABLE IF EXISTS transactions_2023_10;
DROP TABLE IF EXISTS transactions_2023_11;

-- Create a default partition to catch unmatched timestamps
DROP TABLE IF EXISTS transactions_default;
CREATE TABLE transactions_default PARTITION OF transactions DEFAULT;

-- Create monthly partitions for transactions (example for October and November 2023)
CREATE TABLE transactions_2023_10 PARTITION OF transactions
    FOR VALUES FROM ('2023-10-01') TO ('2023-11-01');

CREATE TABLE transactions_2023_11 PARTITION OF transactions
    FOR VALUES FROM ('2023-11-01') TO ('2023-12-01');

-- -- The following extensions require installation:
-- -- If you plan to use Citus for sharding, install it first (see Citus documentation), then uncomment:
-- CREATE EXTENSION IF NOT EXISTS citus;
-- SELECT create_distributed_table('transactions', 'user_id');

-- -- If you plan to use TimescaleDB, install it first (see TimescaleDB documentation), then uncomment:
-- CREATE EXTENSION IF NOT EXISTS timescaledb;
-- SELECT create_hypertable('transactions', 'timestamp');