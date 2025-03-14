import os
from dotenv import load_dotenv
import psycopg2
from faker import Faker
import random

# Load environment variables from .env file
load_dotenv()

DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

# Connect to PostgreSQL database
conn = psycopg2.connect(
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()
fake = Faker()

# Pre-populate assets table for required assets
assets_list = [
    ("BTC", "Bitcoin", "crypto", 50000.00),
    ("AAPL", "Apple Inc.", "stock", 150.00),
    ("ETH", "Ethereum", "crypto", 3000.00)
]
for asset in assets_list:
    cur.execute(
        "INSERT INTO assets (asset_id, name, type, current_price) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING",
        asset
    )

# Generate 1000 users with conflict handling on email uniqueness
for _ in range(1000):
    cur.execute(
        "INSERT INTO users (name, email, kyc_status) VALUES (%s, %s, %s) ON CONFLICT (email) DO NOTHING",
        (fake.name(), fake.email(), random.choice(["verified", "pending", "unverified"]))
    )

# Fetch actual user ids from the users table
cur.execute("SELECT user_id FROM users")
user_ids = [row[0] for row in cur.fetchall()]

# Generate 100,000 transactions using actual user ids
for _ in range(100000):
    user_id = random.choice(user_ids)
    asset_id = random.choice(["BTC", "AAPL", "ETH"])
    timestamp = fake.date_time_between(start_date="-1y", end_date="now")
    cur.execute(
        """INSERT INTO transactions (user_id, asset_id, type, quantity, price, timestamp)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (user_id, asset_id, random.choice(["BUY", "SELL"]), random.uniform(0.1, 100),
         random.uniform(100, 50000), timestamp)
    )

conn.commit()
cur.close()
conn.close()