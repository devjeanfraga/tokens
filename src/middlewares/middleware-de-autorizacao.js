const controleDeAcesso = require('../controleDeAcesso/controle-de-acesso');

const metodos = {
  ler: {
    todos: 'readAny',
    apenasSeu: 'readOwn'
  },

  criar: {
    todos: 'createAny',
    apenasSeu: 'createOwn'
  },

  remover: {
    todos: 'deleteAny',
    apenasSeu: 'deleteOwn'
  }
}

module.exports = ( entidade, acao ) => ( req, res, next ) => {
    const permissoesDoCargo = controleDeAcesso.can(req.user.cargo);
    const acoes = metodos[acao];    
    const permissaoTodos = permissoesDoCargo[acoes.todos](entidade);
    const permissaoApenasSeu = permissoesDoCargo[acoes.apenasSeu](entidade); 

    //Se as duas granted forem falses a pessoa nao pode ler nada
    if ( permissaoTodos.granted  === false && permissaoApenasSeu.granted === false) {
      res.status(403).end();
      return;
   } else {
     req.acesso = {
       todos: {
        permitido: permissaoTodos.granted,
        atributos: permissaoTodos.attributes
       },

       apenasSeu: {
        permitido: permissaoApenasSeu.granted,
        atributos: permissaoApenasSeu.attributes
       }
     };
   };

   next();
}