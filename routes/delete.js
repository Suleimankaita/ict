const express=require("express");
const routes=express()
const {delete_user}=require("../controllers/registration")

routes.route("/").delete(delete_user);

module.exports=routes