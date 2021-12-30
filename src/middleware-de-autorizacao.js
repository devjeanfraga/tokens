module.exports = ( cargoObrigatorios ) => ( req, res, next ) => {
    req.user.cargo = 'assinante';
    if ( cargoObrigatorios.indexOf( req.user.cargo ) === -1 ) {
      console.log('esta rota está bloqueada');
    
   }

   next();
}