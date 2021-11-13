const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./models');
const bcrypt = require('bcrypt');


function verificaUsuario ( usuario) {
  if(!usuario) {
    throw new Error ('Não existe usuário com esse email');
  }
};

async function verificaPassword (password, passwordHash) {
  const passwordValido = bcrypt.compare( password, passwordHash);
  if (!passwordValido) {
    throw new Error ('Email ou senha inválidos')
  }
};

passport.use(
  new LocalStrategy ({
    usernameField : 'email',
    passwordField: 'password', 
    session: false
    
}, async (email, password, done) => {
    try {
      const  usuario = await db.usuario.findOne({where: {email: email}});
      verificaUsuario(usuario);
      await verificaPassword(password, usuario.password)

    } catch (err) {
      done(err)
    }
}))