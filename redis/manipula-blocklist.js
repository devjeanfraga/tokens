const blocklist = require('./blocklist');
const blockList = require('./blocklist');
const jwt = require('jsonwebtoken');

const { createHash } = require('crypto');

const { promisify } =  require('util');
const existTokenAsync = promisify( blockList.exists ).bind( blocklist ); 
const setAsycn = promisify( blockList.set ).bind( blocklist );

//Se como os tokens são grandes para serem chaves, a solução é gerar um hash para compactar a key
function geraTokenHash (token) {
   return createHash('sha256').update( token ).digest("hex");
}


module.exports =  {
  adiciona: async token => {
    //pegar a data de expiração do payload do token. 
    const dataDeExpiracao =  jwt.decode( token ).exp; 
    const tokenHash = geraTokenHash(token);

    await setAsycn(tokenHash, '' );
    blockList.expireat( tokenHash, dataDeExpiracao );

  },

  contemToken: async token => {
    const tokenHash = geraTokenHash( token )
    const resultado =  await existTokenAsync( tokenHash ); // resultato 1 se tiver na base e 0 s enao tiver; 
    return resultado === 1;
  }
}