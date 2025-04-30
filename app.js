const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const env = process.env;
const API = env.API_URL;

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
// app.options('*', cors());

const authRouter = require('./src/routes/auth.route');
app.use(`${API}/`, authRouter);

const hostname = env.HOST;
const port = env.PORT;
const dbUri = env.MONGODB_CONNECTION_STRING;

// Check if MongoDB connection string is defined
if (!dbUri) {
    console.error('MongoDB connection string not defined in environment variables');
    process.exit(1);
}

// MongoDB connection
mongoose.connect(dbUri).then(() => {
    console.log('Connected to Database!');
}).catch((err) => {
    console.error('Database connection error:', err);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});