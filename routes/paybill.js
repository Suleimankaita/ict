const express=require("express")

const {getbill,bill}=require('../controllers/paybill');

const router=express.Router()

router.route('/')
.get(getbill)
.put(bill)

module.exports=router;