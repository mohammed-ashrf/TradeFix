const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const config = require('./config/config');
const app = express();

// Middleware
// app.use(cors({
//   origin: 'http://localhost:4200',
//   credentials: true
// }));
// app.use(cors({
//   origin: '*',
//   credentials: true
// }));
const allowedOrigins = ['http://localhost:4200', 'http://example.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// Start server
connectToDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}...`);
  });
});