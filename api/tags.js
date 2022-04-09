const express = require('express');
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) =>{
    console.log("A request is being made to /tags");

    next();

});

tagsRouter.get('/:tagName/posts', async (req, res) => {
    const { tagName } = req.params;

    try {
        const getPosts = await getPostsByTagName(tagName);

        // You should now update this method to filter out any posts 
        // which are both inactive and not owned by the current user.


        const posts = getPosts.filter(post => {
            return post.active || (req.user && post.author.id === req.user.id);
          });

       
        
       
        // send out an object to the client { posts: // the posts }
        
        res.send(posts)

      } catch(error) {
      console.log("getting tags not working");
      next(error);
        // forward the name and message to the error handler
      }
    }); 

   


module.exports = tagsRouter;