const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require('express').Router();
const User = require('../db').import('../models/user');
const validateSession = require("../middleware/validate-session");


//CREATE A USER - user/create
router.post('/create', function (req, res) {
    User.create({
        email:req.body.email,
        username:req.body.username,
        password:bcrypt.hashSync(req.body.password, 11),
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        role: "User"
    })
    .then(
      function successfulCreation(user) {
          let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
          
          res.status(200).json({
              user:user,
              message: "User created successfully",
              sessionToken: token
          })
      }        
  )
  .catch(err => res.status(500).json({err: err.message || serverErrorMsg
  }))
});


//USER LOGIN - user/login
router.post("/login", function (req, res) {
    User.findOne({
      where: {
        username: req.body.username,
      },
    })
      .then(function loginSuccess(user) {
        if (user) {
          bcrypt.compare(req.body.password, user.password, function (
            err,
            matches
          ) {
            if (matches) {
              let token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                {
                  expiresIn: 60 * 60 * 24,
                }
              );
              res.status(200).json({
                user: user,
                message: "User Successfully Logged in!",
                sessionToken: token,
              });
            } else {
              res.status(502).send({ error: "Login Failed" });
            }
          });
        } else {
          res.status(500).json({ error: "User does not exist" });
        }
      })
      .catch((err) => res.status(500).json({ error: err }));
  });

  router.post("/me", async function (req, res) {
    const { token } = req.body
    const user = await jwt.decode(token, process.env.JWT_SECRET)
    if (!user?.id) {
      console.log(user)
      res.status(500)
      return
    }
    console.log(user)
    await User.findOne({where:{id: user.id}}).then((user) => res.status(200).json({id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }))
  });

module.exports = router;