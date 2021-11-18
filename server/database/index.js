const config = require('../config');
const { db: { database, username, password, host, dialect } } = config;
const Sequelize = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });
} else {
  // the application is executed on the local machine
  sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      }
    }
  });
}


const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database', error);
  }
};

// import models
const modelDefiners = [
  require('./models/portfolio.model')
];

// define models
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

dbConnection();

module.exports = sequelize;