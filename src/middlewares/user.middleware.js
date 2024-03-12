import Jwt from "jsonwebtoken";
import {error,success}from "../utills/responseWrapper.utill.js";

const secretKey = process.env.ACCESS_SECRET_KEY || "greenwebsolutions";

export async function checkUserLogin(req,res,next){
    try {
        if (!req.headers?.authorization?.startsWith("Bearer")){
            return res.send(error(401,"authorization header is required"));
           }
        const accessToken = req.headers.authorization.split(" ")[1];
        const decoded = Jwt.verify(accessToken,secretKey);
        req._id = decoded?._doc?._id;
        next();
    } catch (err) {
        return res.send(error(500,err.message));
    }
}


// export async function signupMiddleware(req,res,next){
//     try{
//         if(Object.keys(req.body).length==0){
//             return res.status(400).send(error(400,"body is required"));
//         }
//         next();
//     }catch (err){
//         return res.send(error(500,err.message));
//     }
// }