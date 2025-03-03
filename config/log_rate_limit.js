const loglimiter=require("express-rate-limit");

const loglimiter=ratelimit({
    windowMs:60*1000,
    Max:5,
    message:{
        message:"Too many Attemps with this ip please try again after one miniute"
    },
    handler:(req,res,next,opt)=>{
//             const times=setInterval(()=>{
//         time=oneminute--
//         console.log(time)
//     if(time===0){
//         clearInterval(times)
//         // console.log(time)

//     }    
// },1000)
// console.log(time)


        console.log(`${req.url} ${req.headers.origin} ${opt.message} ${opt.message.message}`)
        res.status(403).json({"message":opt.message.message,"time":1})
        next()
    },
    StartdardHeaders:true,
    leagcyHeaders:false
})

module.exports=loglimiter;