const express = require('express');
const cors = require('cors');
require('dotenv/config')

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!',
    });
});

const env = process.env;

const hostname = env.HOST;
const port = env.PORT;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});