const crypto =  require('crypto'); 
const moment = require('moment'); 

//Redis
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token'); 
const blockListAccesstoken =  require('../../redis/blocklist-access-token'); 
const listaDeRedefinicaoDeSenha = require('../../redis/listaDeRedefinicaoDeSenha');

//jsonwebToken
const jwt = require('jsonwebtoken');

//Erros
const RefreshTokenInvalid  = require('../err/refreshTokenInvalid');


function  criarWebToken ( id, [tempoQuantidade, tempoUnidade] ) {
  const payload = { id };
  const token = jwt.sign( payload, process.env.KEY_JWT, { expiresIn: tempoQuantidade + tempoUnidade } );
  return token;
  // atributo que poderia ser colado dentro do obj payload: expiraEm: Date.now() + cincoDiasEmMilissegundos = 432000000
  // jwt.sign: Gera e assina o token baseado no payload;
  // cabeçalho gerado automaticamente;
  // segundo parametro é a SENHA SECRETA do servidor:
  //  *** Comando no Terminal ***
  // node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"
}

async function verificaTokenJWT ( token, tokenName, blocklist ) {
  await verificaTokenBlocklist( token , tokenName, blocklist );
  //jwt.verify() de volve o payload se tiver válido
  const { id } = jwt.verify(token, process.env.KEY_JWT); 
  return id; 
}

async function verificaTokenBlocklist ( token, tokenName, blocklist) {
 
  if (!blocklist) {
    return;
  } else {
  const tokenNaBlocklist = await blocklist.contemToken( token ); 
  if ( tokenNaBlocklist ) {
   throw new jwt.JsonWebTokenError(`${ tokenName } inválido por logout !`);
  }
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
      return  verificaTokenJWT( token, this.name, this.lista );
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
  },

  verificacaoEmail: {
    name: 'token de verificação de email', 
    expiracao: [1, 'h'],
    cria ( id ) {
      return criarWebToken(id, this.expiracao);
    },

    verifica ( token ) {
      return verificaTokenJWT(token, this.name);
    },
  },

  RedefinicaoDeSenha: {
    name: 'Token de redefinção de senha',
    lista : listaDeRedefinicaoDeSenha,
    expiracao: [1, 'h'],

    criarToken(id) {
      return criaTokenOpaco( id, this.expiracao, this.lista);
     },

     verifica ( token ) {
      return verificaTokenOpaco ( token, this.lista ); 
    },
  }
} 

