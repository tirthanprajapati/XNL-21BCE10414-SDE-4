# XNL-21BCE10414-SDE-4

## Project Phase 1: Database Design (PostgreSQL)

## 1. Schema Design

### Tables

#### `users` Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  kyc_status VARCHAR(50) CHECK (kyc_status IN ('verified', 'pending', 'unverified')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `assets` Table
```sql
CREATE TABLE assets (
  asset_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('crypto', 'stock', 'commodity')),
  current_price DECIMAL(18, 2) NOT NULL
);
```

#### `transactions` Table (Partitioned)
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

#### `portfolio` Table (Denormalized)
```sql
CREATE TABLE portfolio (
  user_id INT REFERENCES users(user_id),
  asset_id VARCHAR(10) REFERENCES assets(asset_id),
  quantity DECIMAL(18, 8) NOT NULL,
  avg_price DECIMAL(18, 2) NOT NULL,
  PRIMARY KEY (user_id, asset_id)
);
```

### Key Constraints
- Check constraints on `kyc_status` and asset types
- Foreign keys between `transactions` ↔ `users`/`assets`
- Trigger to enforce positive transaction quantities:
  ```sql
  CREATE TRIGGER trigger_check_quantity
  BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION check_transaction_quantity();
  ```

## 2. Partitioning & Sharding

### Implementation
1. **Monthly Partitioning**:
   ```sql
   CREATE TABLE transactions_2023_10 PARTITION OF transactions
     FOR VALUES FROM ('2023-10-01') TO ('2023-11-01');
   ```

2. **Citus Sharding**:
   ```sql
   CREATE EXTENSION citus;
   SELECT create_distributed_table('transactions', 'user_id');
   ```

3. **TimescaleDB Hypertable**:
   ```sql
   SELECT create_hypertable('transactions', 'timestamp');
   ```

## 3. Indexing Strategy

| Table         | Index Type | Columns                     | Purpose                          |
|---------------|------------|-----------------------------|----------------------------------|
| transactions  | B-tree     | `(user_id, asset_id)`       | User-asset transaction queries   |
| transactions  | BRIN       | `timestamp`                 | Time-range analytics             |
| portfolio     | Composite  | `(user_id)`                 | Fast portfolio lookups           |
| assets        | Covering   | `(current_price)`           | Price-based analytics            |

## 4. Data Validation

### Key Mechanisms
- Check constraints for enum values (`kyc_status`, transaction types)
- Trigger-based validation for transaction quantities:
  ```sql
  CREATE OR REPLACE FUNCTION check_transaction_quantity()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.quantity <= 0 THEN
      RAISE EXCEPTION 'Quantity must be positive';
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

## 5. Synthetic Data Generation

### Python Script (`synthetic_data.py`)
```python
import psycopg2
from faker import Faker
import random

# Sample data generation
for _ in range(100000):
    cur.execute(
        "INSERT INTO transactions VALUES (%s, %s, %s, %s, %s, %s)",
        (user_id, asset_id, type, quantity, price, timestamp)
    )
```

## Deliverable Artifacts

1. **ER Diagram**  
   ![ER Diagram](https://i.imgur.com/c8Jm7y4.png)  
   *Created with pgAdmin/dbdiagram.io*

2. **Partitioning/Sharding Proof**  
   - Partition list: `\d+ transactions`  
   - Shard status: `SELECT * FROM citus_shards;`

3. **Index Report**  
   ```sql
   SELECT tablename, indexname, indexdef 
   FROM pg_indexes 
   WHERE schemaname = 'public';
   ```

4. **Synthetic Data Script**  
   - 1000 users with portfolios
   - 100,000 timestamped transactions

---

**End of Phase 1 Deliverables**