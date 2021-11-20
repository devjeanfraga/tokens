const  redis = require('redis');
const blocklist = redis.createClient( {prefix: 'blocklist-access-token:'} );

const manipulaLista = require('./manipula-lista');
const manipulaBlocklist = manipulaLista(blocklist); 

const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');



//Se como os tokens são grandes para serem chaves, a solução é gerar um hash para compactar a key
function geraTokenHash (token) {
   return createHash('sha256').update( token ).digest("hex");
}


module.exports =  {
  adiciona: async token => {
    //pegar a data de expiração do payload do token. 
    const dataDeExpiracao =  jwt.decode( token ).exp; 
    const tokenHash = geraTokenHash(token);

    await manipulaBlocklist.adicionar(tokenHash, '', dataDeExpiracao);
  },

  contemToken: async token => {
    const tokenHash = geraTokenHash( token )
    return await manipulaBlocklist.verificarExistencia( tokenHash ); // resultato 1 se tiver na base e 0 s enao tiver; 

  }
}