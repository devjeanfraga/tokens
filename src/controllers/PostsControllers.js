const db = require('../models');

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
      if(!req.estaAutenticado) {
        allPosts = allPosts.map(post => ({
          titulo: post.titulo
        }));
      }
      return res.status(200).json(allPosts);
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