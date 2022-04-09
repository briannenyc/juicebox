const express = require('express');
const postsRouter = express.Router();
const jwt = require('jsonwebtoken');
const { requireUser } = require('./utils');

const { getAllPosts, createPost, getAllTags, updatePost, getPostById } = require('../db');
const { user } = require('pg/lib/defaults');

postsRouter.use((req, res, next) =>{
    console.log("A request is being made to /posts");

    next();

});


//GET

postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(post => {
      // return post.active || (req.user && post.author.id === req.user.id);
      // the post is not active, but it belogs to the current user
      if (post.active) {
        return true;
      }
    
      // keep a post if it is either active, or if it belongs to the current user
      if (req.user && post.author.id === req.user.id) {
        return true;
      }
    
      // none of the above are true
      return false;
      
    });

    res.send({
      posts
    });

  } catch ({ name, message }) {
    next({ name, message });
  }
});



//POST

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
    const auth = req.header('Authorization');
  const tagArr = tags.trim().split(/\s+/)

  const [, token] = auth.split(' ');

  const recoveredData = jwt.verify(token, process.env.JWT_SECRET);
 console.log(recoveredData)

  const postData = {authorId: recoveredData.id, title: title, content: content, tags: []};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
      console.log(1)
    // add authorId, title, content to postData object
    const post = await createPost(postData);
    console.log(2)
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    res.send({ post })
    // otherwise, next an appropriate error object 
  } catch ({ error }) {
    next({name: "oops", message: "post and tags broke"});
  }
});


//PATCH

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//DELETE

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? { 
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});


module.exports = postsRouter;