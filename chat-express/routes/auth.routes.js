const express = require("express");
const AuthController = require("../controllers/auth.controller");

const authRouter = express();

authRouter.route("/signUp").post(AuthController.signUp);
authRouter.route("/signIn").get(AuthController.signIn);

module.exports = { authRouter };
