class RefreshTokenInvalid extends Error {
  constructor () {
    super('Refresh Inválido');
  }
}

module.exports = RefreshTokenInvalid; 