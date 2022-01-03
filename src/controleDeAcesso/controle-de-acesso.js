const AccessControl = require('accesscontrol');
const controleDeAcesso = new AccessControl();

controleDeAcesso
  .grant('assinante')
  .readAny('posts', ['id', 'titulo', 'conteudo'])
  .readAny('usuarios', ['name']);

controleDeAcesso
  .grant('editor')
  .extend('assinante')
  .createOwn('posts')
  .deleteOwn('posts')

controleDeAcesso
  .grant('admin')
  .createAny('posts')
  .deleteAny('posts')
  .readAny('posts') //quando não colocamos as propriedades que ele pode ler o accesss control poe um "*" indicando que ele pode ler tudo; 
  .readAny('usuarios')
  .deleteAny('usuarios')  

module.exports = controleDeAcesso; //go to middleware de authorizaçao; 


  