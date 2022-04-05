const express = require('express');
const usersRouter = express.Router();

const { getAllUsers } = require('../db');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1 , username: 'albert'  }, process.env.JWT_SECRET);

token; // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvc2h1YSIsImlhdCI6MTU4ODAyNDQwNn0.sKuQjJRrTjmr0RiDqEPJQcTliB9oMACbJmoymkjph3Q'

const recoveredData = jwt.verify(token, process.env.JWT_SECRET);

recoveredData; // { id: 3, username: 'joshua', iat: 1588024406 }


usersRouter.use((req, res, next) =>{
    console.log("A request is being made to /users");

    next();

});

usersRouter.get('/', async (req, res) => {

    const users = await getAllUsers();

    res.send({
        users
    });
});


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && user.password == password) {
        // create token & return to user
        res.send({ token: token, message: "you're logged in!" });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });



module.exports = usersRouter;