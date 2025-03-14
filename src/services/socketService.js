const socketIO = require('socket.io');

function initSocket(server, Transaction, sequelize) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    socket.on('newTransaction', async (data) => {
      const transaction = await Transaction.create(data);
      io.emit('transactionUpdate', transaction);
    });

    sequelize.query('LISTEN transaction_created');
    sequelize.connectionManager.on('notification', (msg) => {
      socket.emit('realTimeData', JSON.parse(msg.payload));
    });
  });
}

module.exports = initSocket;