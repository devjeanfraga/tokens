
class InvalidArgumentError extends Error {
  constructor () {
    super('Você enviou alguma informação errada, por gentileza, verifique os campos e tente novamente :)' )
  }
  
}

module.exports = InvalidArgumentError;