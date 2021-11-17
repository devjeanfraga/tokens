const blacklist = require('./blackList');
const blackList = require('./blackList');
const jwt = require('jsonwebtoken');

const { createHash } = require('crypto');

const { promisify } =  require('util');
const existTokenAsync = promisify( blackList.exists ).bind( blacklist ); 
const setAsycn = promisify( blackList.set ).bind( blacklist );

//Se como os tokens são grandes para serem chaves, a solução é gerar um hash para compactar a key
function geraTokenHash ( token ) {
   return createHash( '256' ).update( token ).digest('hex');
}


module.exports =  {
  adiciona: async token => {
    //pegar a data de expiração do payload do token. 
    const dataDeExpiracao =  jwt.decode( token ).exp; 
    const tokenHash = geraTokenHash( token );

    await setAsycn( tokenHash, '' );
    blackList.expireat( tokenHash, dataDeExpiracao );

  },

  contemToken: async token => {
    const tokenHash = geraTokenHash( token )
    const resultado =  await existTokenAsync( tokenHash ); // resultato 1 se tiver na base e 0 s enao tiver; 
    return resultado === 1;
  }
}