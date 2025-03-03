const verify=require("../middleware/verify")
const refresh=require("../controllers/refresh")
const {addTran,seens}=require("../controllers/registration")
const logout=require("../controllers/logout")
const express=require("express");
const Router=express()

Router.route('/:id')
.put(addTran)
.patch(seens)

// .post(logout)
module.exports=Router;
