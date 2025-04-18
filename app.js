const express = require('express');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const env = process.env;

const hostname = env.HOST;
const port = env.PORT;

console.info('Infomation:', hostname);

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});