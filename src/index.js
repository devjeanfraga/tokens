require('dotenv').config();

const express = require('express');
const routes = require('../src/routes');
const InvalidArgumentError = require('./err/InvalidArgumentError');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

//Inicialização Redis
require('../redis/blocklist-access-token');
require('../redis/allowlist-refresh-token');

const app = express();
routes(app);

//Middeleware de TRATAMENTO DE ERROS;
app.use((err, req, res, next) => {
  let status = 500;
  const body = { message: err.message }
  
  //ifs para verificar que tipo de erro será emitido;
  if ( err instanceof InvalidArgumentError ) {
    status = 400;
  }
  if (err instanceof JsonWebTokenError) {
    status = 401;
  }
  if (err instanceof TokenExpiredError) {
    status = 401;
    body.expiradoEm = err.expiredAt;
  }


  //resposta formatada para ser emitida;
  res.status(status).json(body);
})


app.listen(3939, ()=> {console.log("api run on port 3939")});

