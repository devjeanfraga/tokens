const {Router} = require('express');
const UsuariosControllers = require('../controllers/UsuariosControllers');

const router = Router()

router.post('/usuarios', UsuariosControllers.add);
router.get('/usuarios', UsuariosControllers.list);



module.exports = router