-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    kyc_status VARCHAR(50) CHECK (kyc_status IN ('verified', 'pending', 'unverified')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assets table
CREATE TABLE assets (
    asset_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('crypto', 'stock', 'commodity')),
    current_price DECIMAL(18, 2) NOT NULL
);

-- Create transactions table (partitioned)
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    transaction_id SERIAL,
    user_id INT NOT NULL REFERENCES users(user_id),
    asset_id VARCHAR(10) NOT NULL REFERENCES assets(asset_id),
    type VARCHAR(4) CHECK (type IN ('BUY', 'SELL')),
    quantity DECIMAL(18, 8) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    fee DECIMAL(18, 2) DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (timestamp);

-- Create portfolio table (denormalized for performance)
CREATE TABLE portfolio (
    user_id INT REFERENCES users(user_id),
    asset_id VARCHAR(10) REFERENCES assets(asset_id),
    quantity DECIMAL(18, 8) NOT NULL,
    avg_price DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY (user_id, asset_id)
);

-- Create a trigger function to ensure positive quantities in transactions
CREATE OR REPLACE FUNCTION check_transaction_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be positive';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for transactions to validate quantity
CREATE TRIGGER trigger_check_quantity
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION check_transaction_quantity();