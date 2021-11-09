const {Router} = require('express');
const UsuariosControllers = require('../controllers/UsuariosControllers');

const router = Router()

router.post('/usuarios', UsuariosControllers.add)



module.exports = router