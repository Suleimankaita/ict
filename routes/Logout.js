const verify=require("../middleware/verify")
const refresh=require("../controllers/refresh")
const login=require("../controllers/login")
const logout=require("../controllers/logout")
const express=require("express");
const Router=express()

Router.route('/')

.post(logout)
module.exports=Router;
