// const allowed=["https://KS_banks.onrender.com","https://ks-banks-7cpz.onrender.com",'http://localhost:5173','http://localhost:4000','*','http://172.20.10.3:5173']

// const opt={
//     origin:(origin,cb)=>{
//         if(allowed.includes(origin)|| !origin){
//             cb(null,true)
//         }else{
//             cb(new Error("not allowed by cors"))

//         }
//     },
//     credentials:true
// }
// module.exports=opt

const allowedOrigins = [
    "https://KS_banks.onrender.com",
    "https://ks-banks-7cpz.onrender.com",
    "http://localhost:5173",
    "http://localhost:4000",
    "http://172.20.10.3:5173"
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allows cookies and authentication
    optionsSuccessStatus: 200, // Prevents CORS errors in older browsers
};

module.exports = corsOptions;
