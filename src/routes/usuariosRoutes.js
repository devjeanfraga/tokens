const {Router} = require('express');
const UsuariosControllers = require('../controllers/UsuariosControllers');
const middlewareDeAuthenticacao = require('../middlewares-de-autenticacao')

const router = Router()

router.post('/usuarios', UsuariosControllers.add);
router.post('/usuarios/login', middlewareDeAuthenticacao.local, UsuariosControllers.login)
router.get('/usuarios', UsuariosControllers.list);
router.delete('/usuarios/:userID', middlewareDeAuthenticacao.bearer, UsuariosControllers.remove);



module.exports = router