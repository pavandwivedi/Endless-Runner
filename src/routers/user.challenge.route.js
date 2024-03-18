import express from 'express';
import { checkUserLogin } from  "../middlewares/user.middleware.js";
import { getAllChallengesController, insertChallengeController, updateChallengeController } from '../controllers/challenge.controller.js';


const challengeRouter = express.Router();

challengeRouter.post('/insert',checkUserLogin,insertChallengeController);
 challengeRouter.get('/get',checkUserLogin,getAllChallengesController);
challengeRouter.put('/update',checkUserLogin,updateChallengeController);
// challengeRouter.delete('/delete/:id',checkUserLogin,deleteChallengeController);
// challengeRouter.get('/get/:id',checkUserLogin,getChallengeByIdController);

export default challengeRouter;