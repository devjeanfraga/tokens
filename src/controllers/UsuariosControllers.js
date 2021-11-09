const db = require('../models')

class UsuariosControllers {
  static async add (req, res) {
    const {name, email, password} = req.body
    try{
      const NewUser = await db.usuarios.create({name, email, password})
      return res.status(201).json(NewUser)

    }catch(err){
      return res.json(err)
    }
  }

  static async list (req, res) {
    try{
        const allUsers = await db.usuarios.findAll();
        return res.status(200).json(allUsers)
    }catch (err) {
      return res.status(500).json(err);
    }
  }


}

module.exports = UsuariosControllers