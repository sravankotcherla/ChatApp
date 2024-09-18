const express = require("express");
const UserController = require("../controllers/user.controller");

const UserRouter = express();

UserRouter.route("/search").get(UserController.searchUsers);
UserRouter.route("/session").get(UserController.getSessionInfo);
UserRouter.route("/update").post(UserController.updateUser);

module.exports = UserRouter;
