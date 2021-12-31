module.exports = ( cargoObrigatorios ) => ( req, res, next ) => {
    req.user.cargo = 'admin';
    if ( cargoObrigatorios.indexOf( req.user.cargo ) === -1 ) {
      res.status(403).end();
      return; 
    
   }

   next();
}