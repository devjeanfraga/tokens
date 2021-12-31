//Express Router 
const {Router} = require('express');
const router = Router();

//controllers
const PostsControllers = require('../controllers/PostsControllers')

// Middlewares 
const authenticacao = require('../middlewares-de-autenticacao');
const autorizacao = require('../middleware-de-autorizacao')

router.post('/posts', authenticacao.bearer, PostsControllers.add);
router.get('/posts', PostsControllers.list);
router.delete('/posts/:id', [authenticacao.bearer, autorizacao(['assinante'])], PostsControllers.remove); 

module.exports =  router