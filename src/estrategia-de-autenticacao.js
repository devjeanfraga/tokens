const passport = require('passport');
const jwt = require('jsonwebtoken');

//Erros
const InvalidArgumentError = require('./err/InvalidArgumentError');

//Estrategias 
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

//outros
const db = require('./models');
const bcrypt = require('bcrypt');
 


function verificaUsuario ( usuario) {
  if(!usuario) {
    throw new Error ('Não existe usuário com esse email');
  }
};

/*
function verificaExpiracao(tempoExpiracao) {
  if (tempoExpiracao > Date.now()) {
    throw new ExpirationError('Token expirado!');
  }
 }
 */

async function verificaPassword (password, passwordHash) {
  const passwordValido = await bcrypt.compare( password, passwordHash);
  if (!passwordValido) {
    throw new InvalidArgumentError;
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
        //jwt.verify() de volve o payload se tiver válido
        const payload = jwt.verify(token, process.env.KEY_JWT);
        const usuario = await db.usuarios.findOne({where: {id: payload.id}}) 
        done(null, usuario);
      } catch (err) {
        done(err);
      } 
     }
  )
)


module.exports =  {
  estrategia_de_autenticacao: require('./estrategia-de-autenticacao.js')
}