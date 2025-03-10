const verify = require("../middleware/verify");
const refresh = require("../controllers/refresh");
const express = require("express");
const Router = express.Router(); // Correct initialization of Router

Router.route('/')
.get(refresh)
// .post(logout)

module.exports = Router;
