



const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const { client } = require('./db');
client.connect();

const bodyParser = require('body-parser')
const apiRouter = require('./api');
const morgan = require('morgan');

// server.use(express.urlencoded({ extended: false }))
// server.use(express.json());

server.use(bodyParser.json());
server.use('/api', apiRouter);










server.listen(PORT, () => {
  console.log(`The server is up on port ${PORT}`)
});

server.use(morgan('dev'));

server.use(express.json());

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    // console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });


  server.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});