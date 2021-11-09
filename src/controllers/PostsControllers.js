const db = require('../models');

class PostsControllers {
  static async add (req, res) {
    const {titulo, conteudo} = req.body;

    try{
       const newPost = await db.posts.create({titulo, conteudo});
       return res.status(201).json(newPost);
       
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

module.exports = PostsControllers;