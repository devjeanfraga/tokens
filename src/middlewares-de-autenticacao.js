const passport = require('passport');
const allowlistRefreshToken = require('../redis/allowlist-refresh-token');

const {JsonWebTokenError, TokenExpiredError} = require('jsonwebtoken');
const InvalidArgumentError = require('./err/InvalidArgumentError');
const RefreshTokenInvalid = require('./err/refreshTokenInvalid');
const db = require('./models');


async function verificaRefreshToken ( refreshToken ) {
  if ( !refreshToken ) {
    throw new RefreshTokenInvalid;
  }

  const id = await allowlistRefreshToken.buscar( refreshToken );
  
  if ( !id ) {
    throw new RefreshTokenInvalid; 
  }else{
    return id;
  }

   
};

async function invalidaRefreshToken ( refreshToken ) {
  await allowlistRefreshToken.deletar( refreshToken ); 
}

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
      const id = await verificaRefreshToken(refreshToken);
      await invalidaRefreshToken(refreshToken); 
      req.user = await db.usuarios.findOne({where: {id: id}});
      //console.log(dataValues);
      return next();

    } catch (err) {
      next(err)
      
      if ( err instanceof InvalidArgumentError) {
        return res.status(401).json( { erro: err.message } );

      } else {
        console.log(err);
        return res.status(401).json({message: err.message})
      
      }
      
    }
    
  }
}