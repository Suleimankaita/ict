const allowed=["https://ks-banks-7cpz.onrender.com",'http://localhost:5173','http://localhost:4000',,'*','http://172.20.10.3:5173']

const opt={
    origin:(origin,cb)=>{
        if(allowed.includes(origin)|| !origin){
            cb(null,true)
        }else{
            cb(new Error("not allowed by cors"))

        }
    },
    credentials:true
}
module.exports=opt
