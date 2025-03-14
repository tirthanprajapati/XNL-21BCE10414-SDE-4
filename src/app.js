require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');

const sequelize = require('./config/database');
const Transaction = require('./models/Transaction');
const resolvers = require('./graphql/resolvers');

// Load GraphQL schema from file
const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql', 'schema.graphql'), 'utf8');

const app = express();

// REST API routes
const transactionRoutes = require('./routes/transactions');
const portfolioRoutes = require('./routes/portfolio');
const marketRoutes = require('./routes/market');
const alertsRoutes = require('./routes/alerts');

app.use(cors());
app.use(bodyParser.json());

// Mount REST endpoints
app.use('/transactions', transactionRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/market-data', marketRoutes);
app.use('/alerts', alertsRoutes);

// Apollo Server setup
const apolloServer = new ApolloServer({ typeDefs, resolvers });
(async () => {
  await apolloServer.start();
  // Apollo middleware placed after REST endpoints to avoid conflicts if needed
  app.use(expressMiddleware(apolloServer));
})();

// Create HTTP server for Socket.io
const server = http.createServer(app);
const initSocket = require('./services/socketService');
initSocket(server, Transaction, sequelize);

const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL.');
  } catch (err) {
    console.error('Unable to connect to PostgreSQL:', err);
  }
});