const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const Sequelize = require("sequelize");
const User = require("../model/user");
const { forgotEmailParams } = require("../helpers/email");
const _ = require("lodash");

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
        error: "Error with the database. Please try again later.",
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
        error: "User with that email does not exist. Please register.",
      });
    });
};

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
}); // req.user decoded

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user.id;
  User.findOne({ where: { id: authUserId } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: "Error with the database. Please try again later.",
      });
    });
};

// Forgot password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  // Check if user exists with that email
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User with that email does not exist",
        });
      }

      // generate token and send email to user
      const token = jwt.sign(
        { name: user.name },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: "10m" }
      );

      // Send email
      const params = forgotEmailParams(email, token);

      // Populate db user and send resetpassword link
      return User.update(
        { resetPasswordLink: token },
        { where: { email: email } }
      )
        .then((success) => {
          const sendEmail = sgMail.send(params);

          sendEmail
            .then((data) => {
              console.log("Sendgrid email success", data);
              return res.json({
                message: `Email has been sent to ${email}. Click on the link to reset your password.`,
              });
            })
            .catch((err) => {
              console.log("Sendgrid email pw failed", err);
              return res.status(400).json({
                error: "We could not verify your email. Try agian later.",
              });
            });
        })
        .catch((err) => {
          console.log("Database error", err);
          return res.status(400).json({
            error: "Password reset failed. Please try again later.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: "Error with the database. Please try again later.",
      });
    });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  const hash = bcrypt.hashSync(newPassword, salt);

  if (resetPasswordLink) {
    // check for expiry
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again.",
          });
        }
        // Find reset password link in DB, update it to empty, and set new pw
        User.findOne({ where: { resetPasswordLink: resetPasswordLink } })
          .then((user) => {
            if (err || !user) {
              return res.status(400).json({
                error: "Invalid token. Try again.",
              });
            }

            User.update(
              { password: hash, resetPasswordLink: "" },
              { where: { resetPasswordLink: resetPasswordLink } }
            )
              .then((result) => {
                res.json({
                  message: "Great! Now you can login with your new password",
                });
              })
              .catch((err) => {
                console.log("Reset password error", err);
                res.status(400).json({
                  error: "Password reset failed. Try again.",
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              error: "Error with the database. Please try later.",
            });
          });
      }
    );
  }
};
