const express = require('express');

const { notFound } = require('./middleware/404');
const { serverError } = require('./middleware/500');

const { checkToken, authRoutes } = require('./auth/router');

const server = express();

server.use(express.json());

server.use(authRoutes);

server.get('/loggedin', checkToken, (req, res) => {
  res.status(200).send('You are logged in, ' + req.username);
});

server.use(notFound);
server.use(serverError);

module.exports = {
  server,
};
