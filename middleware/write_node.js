const path=require("path");
const fs=require("fs")
const fsp=require("fs").promises
const {nanoid}=require("@reduxjs/toolkit")
const asynchandler=require("express-async-handler")
const written_nod=asynchandler(async(message,paths)=>{
    const id=nanoid();
    const all=`${id}\t${message}\t`

    if(!fs.existsSync(path.join(__dirname, '..' ,'logs'))){
        await fsp.mkdir(path.join(__dirname, '..' ,'logs'))
    }
    const result=await fsp.appendFile(path.join(__dirname, '..', 'logs' ,paths),all)


})


module.exports=written_nod