const express=require("express");
const router=express.Router();
const verify=require("../middleware/verify")
const {create,update,delete_user,get}=require("../controllers/registration")

router.route('/')
// .get(get)        
.post(create)
.patch(update)
.delete(delete_user)

module.exports=router