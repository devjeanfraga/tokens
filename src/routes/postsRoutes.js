//Express Router 
const {Router} = require('express');
const router = Router();

//controllers
const PostsControllers = require('../controllers/PostsControllers')

// Outros
const middlewareDeAuthenticacao = require('../middlewares-de-autenticacao');

router.post('/posts', middlewareDeAuthenticacao.bearer, PostsControllers.add);
router.get('/posts', PostsControllers.list);

module.exports =  router