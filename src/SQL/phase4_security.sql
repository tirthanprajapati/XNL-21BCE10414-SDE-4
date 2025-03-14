-- 1. Enable Row-Level Security on the transactions table:
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 2. Create a dummy function current_user_id() (modify logic as needed for your app)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS integer AS $$
  SELECT 1;  -- For example, always returns user_id = 1. Replace with your logic.
$$ LANGUAGE sql STABLE;

-- 3. Create a row-level security policy restricting access based on user_id:
CREATE POLICY user_transaction_policy ON transactions
  USING (user_id = current_user_id());

-- 4. Install the pgcrypto extension for data encryption:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 5. Alter the users table to add an "ssn" column if it does not exist:
ALTER TABLE users
ADD COLUMN IF NOT EXISTS ssn BYTEA;

-- 6. Encrypt sensitive data (e.g., social security number) when inserting into the users table:
INSERT INTO users (name, email, kyc_status, ssn)
VALUES (
  'John Doe',
  'john.doe@example.com',
  'verified',
  pgp_sym_encrypt('123-45-6789', 'aes_key')
);

-- To decrypt later, use:
-- SELECT pgp_sym_decrypt(ssn, 'aes_key') AS decrypted_ssn FROM users;