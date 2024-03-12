import Jwt from "jsonwebtoken";
import {error,success}from "../utills/responseWrapper.utill.js";

const secretKey = process.env.ACCESS_SECRET_KEY || "greenwebsolutions";

export async function checkAdminLogin(req,res,next){
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