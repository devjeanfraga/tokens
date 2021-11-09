const {Router} = require('express');
const router = Router();
const PostsControllers = require('../controllers/PostsControllers')

router.post('/posts', PostsControllers.add)

module.exports =  router