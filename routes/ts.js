const verify=require("../middleware/verify")
const refresh=require("../controllers/refresh")
const {addTran,addTran2}=require("../controllers/registration")
const logout=require("../controllers/logout")
const express=require("express");
const Router=express()

Router.route('/:id')
.put(addTran2)
// .post(logout)
module.exports=Router;
