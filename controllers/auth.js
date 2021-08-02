const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.TWILIO_API_KEY);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const Sequelize = require("sequelize");
const User = require("../model/user");

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, salt);

  // Check if user exists in DB
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        User.create({ name, email, password: hash })
          .then((result) => {
            console.log("User created", result);
            res.json({
              message: "User successfully registered.",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              error: "User could not be added to DB. Try again later.",
            });
          });
      } else {
        res.status(400).json({
          error: "Email already exists in database. Try another one",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: "Error",
      });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      const compare = bcrypt.compareSync(password, user.password);

      if (user) {
        // authenticate
        if (!compare) {
          return res.status(400).json({
            error: "Email and password do not match",
          });
        }
        // Generate token and send to client
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        const { id, name, email } = user;

        return res.json({
          token,
          user: { id, name, email },
        });
      }
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({
            error: 'User with that email does not exist. Please register.'
        })
    });
};

exports.requireSignin = expressJWT({secret: process.env.JWT_SECRET, algorithms: ['HS256']}); // req.user decoded
