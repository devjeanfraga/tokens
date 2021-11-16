
class InvalidArgumentError extends Error {
  constructor () {
    super('Email ou senha inválidos')
  }
  
}

module.exports = InvalidArgumentError;