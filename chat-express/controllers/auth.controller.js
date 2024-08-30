const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create({ id: username, username, email, password: hashedPassword })
    .then((resp) => {
      return res.status(200).jsonp("Signed Up Successfully");
    })
    .catch((err) => {
      return res.send(400).send({ msg: "Failed to create new User" });
    });
};

exports.signIn = async (req, res) => {
  const { username, password } = req.query;
  User.findOne({ $or: [{ username: username }, { email: username }] })
    .lean()
    .then((user) => {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            _id: user._id.toString(),
          },
          process.env.JWT_KEY,
          { expiresIn: 30 * 60 },
          function (error, token) {
            if (error) {
              return res
                .status(400)
                .send({ message: "Error while generating JWT", error: error });
            }
            return res.jsonp({
              token,
              userInfo: { ...user, password: undefined },
            });
          }
        );
      } else {
        return res.status(401).send({ message: "Incorrect Credentials" });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .send({ message: "Error while signing in ", error: err });
    });
};

exports.authCheck = (req, res, next) => {
  const token = req?.headers.authorization;
  if (!token?.length) {
    return res.status(401).send("Missing authorization token");
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .send({ error: err, message: "Invalid Authorization Token" });
      }
      req.user = decodedToken;
      return next();
    });
  }
};
