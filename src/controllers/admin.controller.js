import bcrypt from 'bcrypt';
import {error,success} from "../utills/responseWrapper.utill.js";
import { generateAccessToken } from '../services/generateAccessToken.service.js';
import adminModel from '../models/admin.model.js';
import  {userModel}  from '../models/user.model.js';

export async function signupAdminController(req,res){
    try{

        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.send(error(400,"all fields are required"));
       }

       const checkEmail = await adminModel.findOne({email});
       if(checkEmail){
           return res.send(error(400,"email already exist"));
        }

       const checkUsername = await adminModel.findOne({username});
       if(checkUsername){
        return res.send(error(400,"username already exist"));
       }

       
        const hashedPassword = await bcrypt.hash(password,10);
        req.body["password"] = hashedPassword;
        const user = await adminModel.create(req.body);
        const  newuser = await adminModel.findById(user._id);
        return res.send(success(200,"admin created"));

    } catch (err) {
        return  res.send(error(500,err.message));
    }
}


export async function loginAdminController(req,res){
    try {
        const {usernameOrEmail , password}= req.body;

        if(!usernameOrEmail,!password){
            return res.send(error(400,"all fields are needed"));
        }
        const user = await adminModel.findOne({$or:[{"username":usernameOrEmail},{"email":usernameOrEmail}]});
        if(!user){
            return res.send(error(404,"user not found"));
        }

        const matched = await bcrypt.compare(password,user.password);
        if(!matched){
            return res.send(error(401,"wrong password"));
        }

        const accessToken = generateAccessToken({...user});
        return res.send(success(200,{accessToken}));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function getAllUsers(req,res){
    try {
        const users = await userModel.find({}).populate('achivements').populate('levels');
        return res.send(success(200,users));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}