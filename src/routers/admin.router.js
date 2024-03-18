import express from 'express';
import { createChallengeController, deleteChallengeController, getAllUsers, loginAdminController, signupAdminController, updateChallengeController } from '../controllers/admin.controller.js';
import { checkAdminLogin } from '../middlewares/admin.middleware.js';

const adminRouter = express.Router();

adminRouter.post("/signup",signupAdminController);
adminRouter.post("/login",loginAdminController);
adminRouter.get("/getAllUsers",checkAdminLogin,getAllUsers);
adminRouter.post('/createchallenge',checkAdminLogin,createChallengeController);
adminRouter.put('/updatechallenge/:id',checkAdminLogin,updateChallengeController);
adminRouter.delete('/deletechallenge/:id',checkAdminLogin,deleteChallengeController);
// ssh-keygen -t ed25519 -C "kuldeeppanwar460@gmail.com"

export default adminRouter;