const db = require('../models');
const bcrypt = require('bcrypt'); 
const tokens = require('../tokens/tokens')
const {EmailVerificacao} =  require('../emails/emails')

function geraEndereco (rota, token) {
  const baseURL =  process.env.BASE_URL;
  return `${baseURL}${rota}${token}`
}

class UsuariosControllers {
  static async add ( req, res ) {
    const { name, email, cargo, password,  } = req.body;

    try{ 
      const custoHash = 12;
      const senhaHash = await bcrypt.hash( password, custoHash );
      const newUser = await db.usuarios.create( {name, email, cargo, password: senhaHash, emailVerificado: false});

      const token =  tokens.verificacaoEmail.cria(newUser.id);
      const endereco =  geraEndereco('/usuarios/verifica_email/', token);
      const emailVerificacao = new EmailVerificacao(newUser, endereco)
      emailVerificacao.enviarEmail().catch(console.log);

      return res.status( 201 ).json( newUser );
    } catch ( err ){
      console.log( err );
      return res.json( err );

    }
  }

  static async login ( req, res ) {
    try {
      const accessToken = tokens.access.cria( req.user.id );
      const refreshToken  = await tokens.refresh.cria(req.user.id);
      res.set( 'Authorization', accessToken);
      return res.status( 200 ).json({ refreshToken });

    } catch ( err ) {
      console.log( err );

    }
  }

  static async logout ( req, res ) {
    try {
      const token = req.token; //esse token vem do middleware que é recupera da estratégia de autenticação. 
      await tokens.access.invalida( token );
  
      return res.status(204).send();
    } catch (err) {
      console.log(err)
      return res.status(500).json( { erro: err.message } );
      
    }
  }

  static async list (req, res) {
    try{
        const allUsers = await db.usuarios.findAll();
        return res.status(200).json(allUsers)
    }catch (err) {
      return res.status(500).json(err);
    }
  }

  static async verificaEmail ( req, res ) {
    try {
      const usuario =  req.user;
      usuario.update({ emailVerificado: true } );
      return res.status(200).json();
    } catch (err) {
      console.log(err);
    }
  }

  static async remove (req, res) {
    const  {userID} = req.params
    try {
       await db.usuarios.destroy({where: {id: Number(userID)}});
       return res.status(204).json()
    } catch (err) {
      return res.status(500).json({message: "oops algo deu errado!"})
    }
  }


}

module.exports = UsuariosControllers