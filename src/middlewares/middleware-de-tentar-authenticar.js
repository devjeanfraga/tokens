const middlewareDeAuthenticacao = require('../middlewares/middlewares-de-autenticacao');

module.exports = (req, res, next) => {
  //propriedade que verifica se o usuario está autenticado
  req.estaAutenticado = false;

  if(req.get('Authorization')) {
    return middlewareDeAuthenticacao.bearer(req, res, next);

  }
    next(); 
  
} 