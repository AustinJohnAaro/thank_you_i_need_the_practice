const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Todo } = require('../../models');

router.get("/login",(req,res) => {
  if (req.session.loggedIn){
    res.redirect("/")
    return
  }
  res.render("login")
})
router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.username
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
    
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });
  
  });
  
  router.get('/signup', (req, res) => {
    User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
    
          res.json(dbUserData);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  
  });

  module.exports = router; 