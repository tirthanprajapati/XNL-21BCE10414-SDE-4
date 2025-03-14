const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const resolvers = {
  Query: {
    getTransactions: async (_, { user_id, start, end }) => {
      const transactions = await sequelize.query(`
        SELECT * FROM transactions
        WHERE user_id = :user_id
          AND timestamp BETWEEN :start AND :end
        ORDER BY timestamp DESC
        LIMIT 1000
      `, {
        replacements: { user_id, start, end },
        type: QueryTypes.SELECT,
        useMaster: true
      });
      return transactions;
    }
  }
};

module.exports = resolvers;