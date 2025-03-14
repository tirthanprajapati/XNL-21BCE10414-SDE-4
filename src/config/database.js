require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,   
    port: process.env.DB_PORT,  
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' 
           ? { rejectUnauthorized: false } 
           : false
    },
    pool: {
      max: 20,
      idle: 30000
    }
  }
);

module.exports = sequelize;