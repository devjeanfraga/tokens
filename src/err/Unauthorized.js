class Unauthorized extends Error {
  constructor () {
    const message = 'Não foi possível acessar o recurso';
    super(message);
    this.name = 'NãoAutorizado';
  }

}

module.exports = Unauthorized;