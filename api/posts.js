const express = require('express');
const postsRouter = express.Router();
const jwt = require('jsonwebtoken');
const { requireUser } = require('./utils');

const { getAllPosts, createPost, getAllTags, updatePost, getPosByID } = require('../db');
const { user } = require('pg/lib/defaults');

postsRouter.use((req, res, next) =>{
    console.log("A request is being made to /posts");

    next();

});

postsRouter.get('/', async (req, res) => {

    const posts = await getAllPosts();

    res.send({
        posts
    });
});


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






module.exports = postsRouter;