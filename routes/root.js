const expreess=require("express");
const router=expreess()

const path=require("path")

router.route("^/$|/index(.html)?",(req,res)=>{
    res.sendFile(path.join(__dirname, "../view", "index.html"))

})
router.route("/*",(req,res)=>{
    res.sendFile(path.join(__dirname, "../view", "404.html"))

})
module.exports=router