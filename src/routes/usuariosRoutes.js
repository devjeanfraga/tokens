const {Router} = require('express');
const UsuariosControllers = require('../controllers/UsuariosControllers');
const middlewareDeAuthenticacao = require('../middlewares/middlewares-de-autenticacao');
const middlewareDeAuthorizacao = require('../middlewares/middleware-de-autorizacao');

const router = Router()

router.post('/usuarios', UsuariosControllers.add);
router.post('/usuarios/esqueci-minha-senha');
router.post('/usuarios/login', middlewareDeAuthenticacao.local, UsuariosControllers.login);
router.get('/usuarios', [middlewareDeAuthenticacao.bearer, middlewareDeAuthorizacao('usuarios', 'ler')], UsuariosControllers.list);
router.delete('/usuarios/:userID',[middlewareDeAuthenticacao.bearer, middlewareDeAuthenticacao.local, middlewareDeAuthorizacao('usuarios', 'remover')],  UsuariosControllers.remove);
router.post('/usuarios/logout',[ middlewareDeAuthenticacao.refresh, middlewareDeAuthenticacao.bearer ], UsuariosControllers.logout);
router.post('/usuarios/update_token', middlewareDeAuthenticacao.refresh, UsuariosControllers.login);
router.get('/usuarios/verifica_email/:token', middlewareDeAuthenticacao.verificacaoEmail, UsuariosControllers.verificaEmail);


module.exports = router