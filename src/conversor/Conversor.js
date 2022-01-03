
class Conversor {

  converter (dados) {
    //Verificaçao se um dos campos tem "*";
    if(this.camposPublicos.indexOf('*') === -1) {
      dados = this.filtrar(dados);
    } 

   
    
    if (this.tipoDeConteudo === 'json') {
      return this.json(dados);
    }
   
    return dados;
  };

  json (dados) {
    return JSON.stringify(dados); // converte para Json;
  };

  filtrar (dados) {
    console.log(dados);
    if(Array.isArray(dados)) {
      dados = dados.map( (post) => {
       return this.filtrarObjeto(post);
       
      })

    } else {
      dados = this.filtrarObjeto(dados);
    }
    
    return dados;
  };

  filtrarObjeto (objeto) {
    const objetoFiltrado = {};
    this.camposPublicos.forEach((campo)=>{
      //Reflete o que tem dentro do objeto, 1 param o objeto e o 2param o campo a ser verificado se tem nesse objeto 
      if(Reflect.has(objeto, campo)) {
        objetoFiltrado[campo] = objeto[campo];
      }
    });

    return objetoFiltrado;
  };
};

class ConversorPosts extends Conversor {
  constructor (tipoDeConteudo, camposExtras = []) {
    super();
    this.tipoDeConteudo = tipoDeConteudo;
    this.camposPublicos = ['titulo', 'conteudo'].concat(camposExtras);
  };
};

class ConversorUsuarios extends Conversor {
  constructor (tipoDeConteudo, camposExtras) {
    super();
    this.tipoDeConteudo = tipoDeConteudo;
    this.camposPublicos = ['name'].concat(camposExtras);
  }
}


module.exports = {
  ConversorPosts,
  ConversorUsuarios
};