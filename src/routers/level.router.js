import express from 'express';
import { getLevelController, postLevelController, updateLevelController } from '../controllers/level.controller.js';
import  {checkUserLogin} from '../middlewares/user.middleware.js';


const levelRouter = express.Router();

levelRouter.post('/insert',checkUserLogin,postLevelController);
levelRouter.get('/retrieve/:levelNo',checkUserLogin, getLevelController);
levelRouter.patch('/update/:levelNo',checkUserLogin,updateLevelController);

export default levelRouter;