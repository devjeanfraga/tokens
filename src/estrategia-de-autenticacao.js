const passport = require('passport');

//Erros
const InvalidArgumentError = require('./err/InvalidArgumentError');
const Unauthorized = require('./err/Unauthorized');

//Estrategias 
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

//Database
const db = require('./models');

//comparação de critografia com bcrypt
const bcrypt = require('bcrypt');

//Manipulação de tokens
const tokens = require('./tokens/tokens');

/*

function verificaExpiracao(tempoExpiracao) {
  if (tempoExpiracao > Date.now()) {
    throw new ExpirationError('Token expirado!');
  }
 }

 */

function verificaUsuario ( usuario) {
  if(!usuario) {
    throw new Unauthorized();
  }
};

async function verificaPassword (password, passwordHash) {
  const passwordValido = await bcrypt.compare( password, passwordHash);
  if (!passwordValido) {
    throw new Unauthorized();
  }
};


passport.use(
  new LocalStrategy ({
    usernameField : 'email',
    passwordField: 'password', 
    session: false
    
}, async (email, password, done) => {
    try {
      const  usuario = await db.usuarios.findOne({where: {email: email}});
      verificaUsuario(usuario);
      await verificaPassword(password, usuario.password)
     
      done(null, usuario);
    } catch (err) {
      done(err)
    }
}));

passport.use(
  new BearerStrategy (
     async (token, done) =>{
      try {
        const id = await tokens.access.verifica(token)
        const usuario = await db.usuarios.findOne({where: { id }}) 
       
        done(null, usuario, { token: token });
      } catch (err) {
        done(err);
      } 
     }
  )
)


module.exports =  {
  estrategia_de_autenticacao: require('./estrategia-de-autenticacao.js')
}