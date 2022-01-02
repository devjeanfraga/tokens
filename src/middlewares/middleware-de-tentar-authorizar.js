const middlewareDeAutorizacao = require('../middlewares/middleware-de-autorizacao');

module.exports = (entidade, acao) =>  (req, res, next) => {
  if (req.estaAutenticado === true ) {
    return middlewareDeAutorizacao( entidade, acao )(req, res, next);
  } else {
    next()
  } 
}