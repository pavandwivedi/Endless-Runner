import express from 'express';
import { createChallengeController, deleteChallengeController, getAllUsers, loginAdminController, signupAdminController, updateChallengeController,getChallengeController } from '../controllers/admin.controller.js';
import { checkAdminLogin } from '../middlewares/admin.middleware.js';

const adminRouter = express.Router();

adminRouter.post("/signup",signupAdminController);
adminRouter.post("/login",loginAdminController);
adminRouter.get("/getAllUsers",checkAdminLogin,getAllUsers);
adminRouter.post('/createchallenge',checkAdminLogin,createChallengeController);
adminRouter.put('/updatechallenge/:id',checkAdminLogin,updateChallengeController);
adminRouter.delete('/deletechallenge/:id',checkAdminLogin,deleteChallengeController);



export default adminRouter;