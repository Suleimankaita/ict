const express=require("express");
const router=express.Router();
const verify=require("../middleware/verify")
const {create,update,delete_user,get}=require("../controllers/registration")

router.route('/:id')
.patch(update)

module.exports=router