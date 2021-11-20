const {promisify} = require('util');


//lista será o client-redis que vamos receber da block list.
module.exports = lista => {
  const setAsync = promisify( lista.set ).bind( lista );
  const existsAsync = promisify( lista.exists ).bind( lista );
  const getAsync = promisify( lista.get ).bind( lista );
  const delAsycn = promisify( lista.del ).bind( lista );

  return {
    async adicionar ( chave, valor, dataExpiracao ) {
      await setAsync( chave, valor );
      lista.expireat( chave, dataExpiracao );
    },

    async buscar ( chave ) {
      //const key = `allowlist-refresh-token:${chave}`;
      return await getAsync( chave );

    },

    async verificarExistencia ( chave ) {
      const resultado = await existsAsync( chave );
      return resultado === 1; 
    }, 

    async deletar ( chave ) {
      await delAsycn( chave ); 
    }

  }
}