import express from 'express';
import { getAllUsers, loginAdminController, signupAdminController } from '../controllers/admin.controller.js';
import { checkAdminLogin } from '../middlewares/admin.middleware.js';

const adminRouter = express.Router();

adminRouter.post("/signup",signupAdminController);
adminRouter.post("/login",loginAdminController);
adminRouter.get("/getAllUsers",checkAdminLogin,getAllUsers);
// ssh-keygen -t ed25519 -C "kuldeeppanwar460@gmail.com"

export default adminRouter;