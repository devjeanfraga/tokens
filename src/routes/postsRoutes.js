//Express Router 
const {Router} = require('express');
const router = Router();

//controllers
const PostsControllers = require('../controllers/PostsControllers')

// Middlewares 
const authenticacao = require('../middlewares/middlewares-de-autenticacao');
const autorizacao = require('../middlewares/middleware-de-autorizacao');
const tentarAuthenticar = require('../middlewares/middleware-de-tentar-authenticar')
const tentarAuthorizar = require('../middlewares/middleware-de-tentar-authorizar')

router.post('/posts',[ authenticacao.bearer, autorizacao('posts', 'criar') ], PostsControllers.add);
router.get('/posts', [tentarAuthenticar, tentarAuthorizar('posts', 'ler')], PostsControllers.list); //publica 
router.get('/posts/:id',[ authenticacao.bearer ,autorizacao('posts', 'ler')], PostsControllers.index);
router.delete('/posts/:id', [authenticacao.bearer, authenticacao.local, autorizacao('posts', 'remover')], PostsControllers.remove); 

module.exports =  router