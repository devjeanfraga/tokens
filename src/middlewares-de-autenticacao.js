const passport = require('passport');

const {JsonWebTokenError, TokenExpiredError} = require('jsonwebtoken');
const InvalidArgumentError = require('./err/InvalidArgumentError');
const tokens = require('./tokens/tokens')
const db = require('./models');


module.exports = {
  local: ( req, res, next ) => {
    passport.authenticate( 'local',
     { session: false },
     ( erro, usuario, info ) => {
      
      if ( erro && erro instanceof InvalidArgumentError) {
        return res.status(401).json( { erro: erro.message} );

      } else if ( erro ) {
        return res.status(500).json( { erro: erro.message } );

      } else if ( !usuario ) { 
        return res.status(401).json();
      }

      req.user = usuario;
      return next()
     } 
    ) ( req, res, next );
  }, 

  bearer:  ( req, res, next ) => {
   passport.authenticate( 'bearer',
   { session: false },
   (erro, usuario, info)=> {
     
    //Erros vindos do JWT.verify()
    if (erro && erro instanceof JsonWebTokenError) {
      return res.status(401).json( { erro: erro.message } );
      
    }
    if ( erro && erro instanceof TokenExpiredError ) {
      return res.status( 401 ).json( { erro: erro.message, expiradoEm: erro.expiredAt } )
    } 
    if ( erro ) {
      console.log(erro)
      return res.status(500).json( { erro: erro.message } );

    }  
    if ( !usuario ) {
      return res.status(401).json();

    }
    req.token = info.token;
    req.user = usuario;
    return next();
   } ) ( req, res, next );
  },
  
  refresh: async ( req, res, next ) => {
    try { 
      const { refreshToken } = req.body;
      const id = await tokens.refresh.verifica(refreshToken);
      await tokens.refresh.invalida(refreshToken); 
      req.user = await db.usuarios.findOne({where: {id: id}});
      //console.log(dataValues);
      return next();

    } catch (err) {
      next(err)
      
      if ( err instanceof InvalidArgumentError) {
        return res.status(401).json( { erro: err } );

      } else {
        console.log(err);
        return res.status(401).json({message: err})
      
      }
      
    }
    
  },

  verificacaoEmail: async ( req, res, next ) => {
    try {
      const  { token } = req.params;
      const id = await tokens.verificacaoEmail.verifica(token);
      const usuario =  await db.usuarios.findOne( {where: { id: id }} );
      req.user = usuario; 
      next()
    } catch ( err ) {
      console.log(err); 
      //err do jasonWeb Token 
      // ou err do tokenExpiredError
    }
  },
  
  
}