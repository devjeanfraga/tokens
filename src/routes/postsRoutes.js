const {Router} = require('express');
const router = Router();
const PostsControllers = require('../controllers/PostsControllers')

router.post('/posts', PostsControllers.add);
router.get('/posts', PostsControllers.list);

module.exports =  router