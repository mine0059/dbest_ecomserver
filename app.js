const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const authJwt = require('./src/middlewares/jwt');
const errorHandler = require('./src/middlewares/error_handler');

const app = express();
const env = process.env;
const API = env.API_URL;

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
// app.options('*', cors());
app.use(authJwt());
app.use(errorHandler);

const authRouter = require('./src/routes/auth.route');
const usersRouter = require('./src/routes/users.route');
const adminRouter = require('./src/routes/admin.route');
const categoryRouter = require('./src/routes/categories.route');

app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
});

app.use(`${API}/`, authRouter);
app.use(`${API}/users`, usersRouter);
app.use(`${API}/admin`, adminRouter);
app.use(`${API}/categories`, categoryRouter);
app.use('/public', express.static(__dirname + '/public'));

const hostname = env.HOST;
const port = env.PORT;
const dbUri = env.MONGODB_CONNECTION_STRING;

// Check if MongoDB connection string is defined
if (!dbUri) {
    console.error('MongoDB connection string not defined in environment variables');
    process.exit(1);
}

require('./src/helpers/cron_job');

// MongoDB connection
mongoose.connect(dbUri).then(() => {
    console.log('Connected to Database!');
}).catch((err) => {
    console.error('Database connection error:', err);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});