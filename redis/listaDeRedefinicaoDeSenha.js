const redis = require('redis');
const manipulaLista = require('./manipula-lista');

const connection = redis.createClient({ prefix: 'Redefinição-de-Senha' });

module.exports = manipulaLista(connection);  

