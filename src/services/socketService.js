const socketIO = require('socket.io');
const { Client } = require('pg');

function initSocket(server, Transaction, sequelize) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173", // allow your frontend
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    socket.on('newTransaction', async (data) => {
      const transaction = await Transaction.create(data);
      io.emit('transactionUpdate', transaction);
    });
  });

  // Set up a dedicated PostgreSQL client to listen for NOTIFY events.
  const pgClient = new Client({
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.PG_USER || 'postgres',
    password: String(process.env.PG_PASSWORD || process.env.DB_PASSWORD || '')
  });

  pgClient.connect()
    .then(() => {
      console.log('Connected to PostgreSQL for notifications.');
      return pgClient.query('LISTEN transaction_created');
    })
    .then(() => {
      console.log('Listening for notifications on channel "transaction_created".');
    })
    .catch(err => {
      console.error('Error connecting PG Client for notifications:', err);
    });

  pgClient.on('notification', (msg) => {
    try {
      io.emit('realTimeData', JSON.parse(msg.payload));
    } catch (e) {
      console.error("Failed to parse notification payload:", e);
    }
  });
}

module.exports = initSocket;