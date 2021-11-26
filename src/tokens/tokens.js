const crypto =  require('crypto'); 
const moment = require('moment'); 
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token'); 
const blockListAccesstoken =  require('../../redis/blocklist-access-token'); 
const jwt = require('jsonwebtoken');


function criarWebToken ( id, [tempoQuantidade, tempoUnidade] ) {
  const payload = { id };
  const token = jwt.sign( payload, process.env.KEY_JWT, { expiresIn: tempoQuantidade + tempoUnidade } );
  return token;
  // atributo que poderia ser colado dentro do obj payload: expiraEm: Date.now() + cincoDiasEmMilissegundos = 432000000
  // jwt.sign: Gera e assina o token baseado no payload;
  // cabeçalho gerado automaticamente;
  // segundo parametro é a SENHA SECRETA do servidor(require(crypto).randomBytes(256).toString('base64'))
}

async function verificaTokenJWT ( token, blocklist, tokenName ) {
  await verificaTokenBlocklist( token , blocklist, tokenName );
  //jwt.verify() de volve o payload se tiver válido
  const { id } = jwt.verify(token, process.env.KEY_JWT); 
  return id; 
}

async function verificaTokenBlocklist ( token, blocklist, tokenName) {
  const tokenNaBlocklist = await  blocklist.contemTokem( token ); 
 if ( tokenNaBlocklist ) {
   throw new jwt.JsonWebTokenError(`${ tokenName } inválido por logout !`);
 }
}

function inavlidaTokenJWT ( token, blocklist ) {
  return blocklist.adicona( token );
}

async function criaTokenOpaco ( id, [ tempoQuantidade, tempoUnidade ], allowlist ) {
  const tokenOpaco = crypto.randomBytes(24).toString('hex');
  const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix(); 
  await allowlist.adicionar(tokenOpaco, id, dataExpiracao); 
  return tokenOpaco;
}

async function verificaTokenOpaco ( token, allowlist ) {
  verificaTokenEnviado(token);

  const id = await allowlist.buscar( token );
  
  verificaTokenInvalido(id);

  return id;   
};

function verificaTokenInvalido(id) {
  if (!id) {
    throw new RefreshTokenInvalid;
  }
}

function verificaTokenEnviado(token) {
  if (!token) {
    throw new RefreshTokenInvalid;
  }
}

async function invalidaTokenOpaco ( token, allowlist ) {
  await allowlist.deletar( token ); 
}



module.exports = {
  access: {
    name: 'refresh',
    lista: blockListAccesstoken,
    expiracao: [ 15, 'm' ], 

    cria ( id ) {
      return criarWebToken( id, this.expiracao );
    }, 
    verifica ( token ) {
      return  verificaTokenJWT( token, this.lista, this.name );
    },

    invalida ( token ) {
      return  inavlidaTokenJWT( token, this.lista );
    }
  },

  refresh: {
    lista: allowlistRefreshToken,
    expiracao: [ 5 , 'd' ],

    cria ( id ) {
      return criaTokenOpaco( id, this.expiracao, this.lista );
    },

    verifica ( token ) {
      return verificaTokenOpaco ( token, this.lista ); 
    },

    invalida ( token ) {
      invalidaTokenOpaco( token, this.lista );
    }
  }
} 

