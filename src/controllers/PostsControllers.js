const db = require('../models');
const {ConversorPosts} = require('../conversor/Conversor')

class PostsControllers {
  static async add (req, res) {
    const {titulo, conteudo} = req.body;

    try{
       const newPost = await db.posts.create({titulo, conteudo});
       return res.status(201).json(newPost);

    } catch (err) {
      console.log(err)
    }
  }

  static async list (req, res) {
    try {
      let allPosts = await db.posts.findAll();
      const conversor = new ConversorPosts('json', req.acesso.todos.permitido ? 
      req.acesso.todos.atributos : req.acesso.apenasSeu.atributos);

      if(!req.estaAutenticado) {
        allPosts = allPosts.map(post => {
         post.conteudo = post.conteudo.substr(0, 10) + '... você deve assinar o blog para ter acesso a restante do conteúdo';
        return post;
        });
      }
      console.log(conversor.converter(allPosts));
      return res.status(200).send(conversor.converter(allPosts));
    }catch (err) {
      console.log(err)
      return res.status(500).json(err);
    }
  }

  static async index (req, res) {
    try {
      const {id} = req.params
      const post = await db.posts.findOne({where: {id: id}});
  
      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      res.status(404).json(err);
    }
  }

  static async remove (req, res) {
    const { id } = req.params
    try {
       await db.posts.destroy( { where: { id: Number( id ) } } );
       return res.status(204).json()
    } catch (err) {
      console.log(err )
    }
  }
}

module.exports = PostsControllers;