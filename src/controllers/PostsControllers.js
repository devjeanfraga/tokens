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
      const allPosts = await db.posts.findAll();
      return res.status(200).json(allPosts);
    }catch (err) {
      return res.status(500).json(err);
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