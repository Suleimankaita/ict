const verify = require("../middleware/verify")
const refresh = require("../controllers/refresh")
const express = require("express");
const Router = express()

// Middleware to set CORS headers
Router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ks-banks-7cpz.onrender.com/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

Router.route('/')
.get(refresh)
// .post(logout)
module.exports = Router;
