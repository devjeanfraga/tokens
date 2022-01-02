const AccessControl = require('accesscontrol');
const controleDeAcesso = new AccessControl();

controleDeAcesso
  .grant('assinante')
  .readAny('posts', ['id', 'titulo', 'conteudo']);

controleDeAcesso
  .grant('editor')
  .extend('assinante')
  .createOwn('posts')
  .deleteOwn('posts')

controleDeAcesso
  .grant('admin')
  .createAny('posts')
  .deleteAny('posts')
  .readAny('posts')
  .readAny('usuarios')
  .deleteAny('usuarios')  

module.exports = controleDeAcesso; //go to middleware de authorizaçao; 


  