const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis error', err));

const getTransactions = async (user_id, Transaction) => {
  const cacheKey = `transactions:${user_id}`;
  const cachedData = await client.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);

  const data = await Transaction.findAll({ where: { user_id } });
  await client.setEx(cacheKey, 60, JSON.stringify(data));
  return data;
};

module.exports = { getTransactions };