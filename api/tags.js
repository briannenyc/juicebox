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
         // use our method to get posts by tag name from the db
        const getTags = await getPostsByTagName(tagName);
       
        // send out an object to the client { posts: // the posts }
        
        res.send(getTags)

      } catch(error) {
      console.log("getting tags not working");
      next(error);
        // forward the name and message to the error handler
      }
    }); 

   


module.exports = tagsRouter;