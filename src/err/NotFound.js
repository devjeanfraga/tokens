
class Notfound extends Error {
  constructor(entidade) {
    const message = `Não foi possível encontrar ${ entidade }`;
    super(message);
    this.name = 'NãoEncontrado';
  }
}

module.exports = Notfound;