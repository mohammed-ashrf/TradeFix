const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const config = require('./config/config');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });
// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// Start server
connectToDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}...`);
  });
});