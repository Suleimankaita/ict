// const verify = require("../middleware/verify");
// const refresh = require("../controllers/refresh");
// const express = require("express");
// const Router = express.Router(); // Correct initialization of Router

// Router.route('/')
// .get(refresh)
// // .post(logout)

// module.exports = Router;
const verify = require("../middleware/verify");
const refresh = require("../controllers/refresh");
const express = require("express");
const Router = express.Router(); // Correct initialization of Router

// Use POST for refreshing tokens
Router.route("/")
  .post(refresh); 

// .post(logout) // Uncomment if needed

module.exports = Router;
