require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { logEvents } = require('./middleware/logger');
const connectDB = require('./config/dbConn.js');
const route = require('./route/index');

const PORT = process.env.PORT || 3500;

route(app);

connectDB();

mongoose.connection.once('open', () => {
   console.log('Connected to mongoDB');
   app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
   console.log(err);
   logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'mongoErrLog.log'
   );
});
