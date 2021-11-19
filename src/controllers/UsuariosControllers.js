const db = require('../models');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const blocklist = require('../../redis/manipula-blocklist');

const crypto =  require('crypto'); 
const moment = require('moment'); 


function criarWebToken ( usuario ) {
  const payload = {
    id: usuario.id
    //expiraEm: Date.now() + cincoDiasEmMilissegundos = 432000000
  };

  //Gera e assina o token baseado no payload
  const token = jwt.sign( payload, process.env.KEY_JWT, { expiresIn: '10m' } );
  return token;
}

function criaTokenOpaco (usuario) {
  const tokenOpaco = crypto.randomBytes(24).toString('hex');
  const dataExpiracao = moment().add(5, 'd').unix(); 
  return tokenOpaco;
}


class UsuariosControllers {
  static async add ( req, res ) {
    const {name, email, password} = req.body;

    try{
      const custoHash = 12;
      const senhaHash = await bcrypt.hash( password, custoHash );
      const NewUser = await db.usuarios.create( { name, email, password:senhaHash } );
      return res.status( 201 ).json( NewUser );

    } catch ( err ){
      console.log( err );
      return res.json( err );

    }
  }

  static async login ( req, res ) {
    try {
      const accessToken = criarWebToken( req.user );
      const refreshToken  = criaTokenOpaco();
      res.set( 'Authorization', accessToken);
      return res.status( 200 ).json({ RefreshToken: refreshToken});

    } catch ( err ) {
      console.log( err );

    }
  }

  static async logout ( req, res ) {
    try {
      const token = req.token; //esse token vem do middleware que é recupera da estratégia de autenticação. 
      await blocklist.adiciona( token );
  
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