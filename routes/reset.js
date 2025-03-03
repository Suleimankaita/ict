const express=require("express")
const post=require('../controllers/reset');


const router=express.Router()

router.route('/:id')
.post(post)


module.exports=router;