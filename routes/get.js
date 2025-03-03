const express=require("express");
const router=express();
const verify=require("../middleware/verify")
const {create,update,delete_user,get}=require("../controllers/registration")

router.route('/')

.get(verify,get)


module.exports=router