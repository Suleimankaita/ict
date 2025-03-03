const express=require("express")
const post=require('../controllers/forget');


const router=express.Router()

router.route('/')
.post(post)


module.exports=router;