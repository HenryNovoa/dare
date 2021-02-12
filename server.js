const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const winston = require('winston');
const config = require('./config');
const packageJSON = require('./package.json');

// Import variables from the .env file
const { API_PORT, HOST } = config;

const app = express();

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'server.log' }),
  ],
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

// Upload the routes
const {
  user,
  policy,
  client,
} = require('./src/routes');

// Define global middleware
app.use(express.json());

// Defines the routes used.
app.use('/api', user);
app.use('/api', policy);
app.use('/api', client);

// Log if the server has been successfully initiated
app.listen(API_PORT, HOST, () => logger.info(`${packageJSON.name} ${packageJSON.version} running and listening at http://${HOST}:${API_PORT}/api`));

// Log if the server is abruptly disconnected
process.on('SIGINT', () => {
  logger.info('Server abruptly stopped');

  process.exit(0);
});

module.exports = app;
