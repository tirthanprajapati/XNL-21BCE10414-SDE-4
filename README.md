# XNL-21BCE10414-SDE-4

## FinTech Platform - Extreme Database Design
**Phase 1: Database Design & Architecture**  
*Time Limit: 36 Hours | Technology: PostgreSQL + Citus + TimescaleDB*

---

## Table of Contents
1. [Database Schema Design](#1-database-schema-design)
2. [Partitioning & Sharding Strategy](#2-partitioning--sharding-strategy)
3. [Indexing Strategy](#3-indexing-strategy)
4. [Data Validation](#4-data-validation)
5. [Synthetic Data Generation](#5-synthetic-data-generation)
6. [Deliverables](#6-deliverables)
7. [Installation & Setup](#7-installation--setup)

---

## 1. Database Schema Design

### Tables Structure

#### Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  kyc_status VARCHAR(50) CHECK (kyc_status IN ('verified', 'pending', 'unverified')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Assets Table
```sql
CREATE TABLE assets (
  asset_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('crypto', 'stock', 'commodity')),
  current_price DECIMAL(18, 2) NOT NULL
);
```

#### Transactions Table (Partitioned)
```sql
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
```

#### Portfolio Table
```sql
CREATE TABLE portfolio (
  user_id INT REFERENCES users(user_id),
  asset_id VARCHAR(10) REFERENCES assets(asset_id),
  quantity DECIMAL(18, 8) NOT NULL,
  avg_price DECIMAL(18, 2) NOT NULL,
  PRIMARY KEY (user_id, asset_id)
);
```

---

## 2. Partitioning & Sharding Strategy

### Hybrid Architecture
```sql
-- Enable Extensions
CREATE EXTENSION citus;
CREATE EXTENSION timescaledb;

-- Create Monthly Partitions
CREATE TABLE transactions_2023_10 PARTITION OF transactions
  FOR VALUES FROM ('2023-10-01') TO ('2023-11-01');

-- Configure Sharding
SELECT create_distributed_table('transactions', 'user_id');

-- Convert to Hypertable
SELECT create_hypertable(
  'transactions', 
  'timestamp', 
  chunk_time_interval => INTERVAL '1 month'
);
```

---

## 3. Indexing Strategy

| Table         | Index Type | Columns               | Creation Command                          |
|---------------|------------|-----------------------|-------------------------------------------|
| transactions  | B-Tree     | (user_id, asset_id)   | `CREATE INDEX idx_txn_user_asset ON transactions(user_id, asset_id)` |
| transactions  | BRIN       | timestamp             | `CREATE INDEX idx_txn_time ON transactions USING BRIN(timestamp)` |
| portfolio     | Composite  | user_id               | `CREATE INDEX idx_portfolio_user ON portfolio(user_id)` |
| assets        | Covering   | current_price         | `CREATE INDEX idx_asset_price ON assets(current_price)` |

---

## 4. Data Validation

### Constraints & Triggers
```sql
-- Quantity Validation Trigger
CREATE OR REPLACE FUNCTION check_transaction_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Invalid transaction quantity: %', NEW.quantity;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_quantity
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION check_transaction_quantity();
```

---

## 5. Synthetic Data Generation

### Python Script (`generate_data.py`)
```python
import psycopg2
from faker import Faker
from datetime import datetime, timedelta

# Configuration
DB_CONFIG = {
    "host": "localhost",
    "database": "fintech",
    "user": "postgres",
    "password": "admin"
}

def generate_users(num=1000):
    conn = psycopg2.connect(**DB_CONFIG)
    # ... full implementation in repository
```

**Execution Command:**
```bash
python3 generate_data.py --users 1000 --transactions 100000
```

---

## 6. Deliverables

1. **ER Diagram**  
   [![ER Diagram](https://i.imgur.com/c8Jm7y4.png)](er_diagram.pdf)

2. **Partitioning/Sharding Proof**  
   - Partition List: `\d+ transactions`
   - Shard Status: `SELECT * FROM citus_shards;`

3. **Index Report**  
   ```sql
   SELECT tablename, indexname, indexdef 
   FROM pg_indexes 
   WHERE schemaname = 'public';
   ```

4. **Optimization Metrics**  
   - [Query Performance Report](optimization_report.pdf)
   - Before/After Indexing Benchmarks

---

## 7. Installation & Setup

### Prerequisites
- PostgreSQL 14+
- Citus Extension
- TimescaleDB Extension
- Python 3.8+

### Deployment Steps
```bash
# Clone repository
git clone https://github.com/yourusername/XNL-21BCE10414-SDE-4.git

# Initialize database
psql -U postgres -c "CREATE DATABASE fintech"
psql -U postgres -d fintech -f schema.sql

# Generate synthetic data
pip install -r requirements.txt
python generate_data.py

# Enable monitoring
docker-compose up -d prometheus grafana
```

---

**License**  
This project is part of XNL Innovations SDE Task 4. All rights reserved.