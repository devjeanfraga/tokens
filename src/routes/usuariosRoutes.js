const {Router} = require('express');
const UsuariosControllers = require('../controllers/UsuariosControllers');
const passport = require ('passport');

const router = Router()

router.post('/usuarios', UsuariosControllers.add);
router.post('/usuarios/login', passport.authenticate('local', {session: false}), UsuariosControllers.login)
router.get('/usuarios', UsuariosControllers.list);
router.delete('/usuarios/:userID', UsuariosControllers.remove);



module.exports = router