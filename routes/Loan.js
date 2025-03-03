const express=require("express")
const {loan,getloan}=require('../controllers/Request_loan');


const router=express.Router()

router.route('/')
.get(getloan)
.put(loan)

module.exports=router;