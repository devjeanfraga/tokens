const redis = require( 'redis' );

//configuração com prefixo
module.exports = redis.createClient( { prefix: 'blacklist:'} );

