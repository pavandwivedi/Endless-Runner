import levelModel from "../models/level.model.js";
import {userModel} from "../models/user.model.js";
import { error, success } from "../utills/responseWrapper.utill.js";

export async function postLevelController(req, res) {
  try {
    const { level, status, score, star } = req.body;
    if (!level || !status || !score || !star) {
      return res.send(error(400, "missing fields"));
    }
    const user = req._id;
    const checkUser = await userModel.findById(user);
    if(!checkUser){
      return res.send(error(404,"user no more exist"));
    }
    const existingLevel = await levelModel.findOne({$and:[{user},{level}]});

    if(existingLevel){
        return res.send(error(409,"can't create level again"));
    }
    const levelInfo = new levelModel({ level, status, score, star, user });
    const createdLevelInfo = await levelInfo.save();
    const currUser = await userModel.findById(user);
    currUser?.levels.push(createdLevelInfo._id);
    
    if(currUser.highestScore<score){
      currUser.highestScore = score;
    }
    await currUser.save();

    return res.send(success(201, "Level created"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}

export async function getLevelController(req, res) {
  try {
    const levelNo = req.params.levelNo;
    const user = req._id;

    const levelInfo = await levelModel.findOne({
      $and: [{ level: levelNo }, { user }]
    });

    if (!levelInfo) {
      return res.send(error(404, "level info doesn't exist"));
    }
    return res.send(success(200, levelInfo));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}

export async function updateLevelController(req,res){
    try{
        const levelNo = req.params.levelNo;
        const user = req._id;
        const {score , star} = req.body;
        const levelInfo = await levelModel.findOne({$and:[{"level":levelNo},{user}]});
        const currUser = await userModel.findById(user);

        if(!levelInfo){
            return res.send(error(404,"level info does not exist"));
        }

        if(levelInfo["score"]<score){
            levelInfo["score"]=score;
        }

        if(levelInfo["star"]<star){
            levelInfo["star"]=star;
        }
        
        if(currUser.highestScore<score){
          currUser.highestScore = score;
        }
        await currUser.save();

        const savedLevel = await levelInfo.save();
        return res.send(success(200,"level updated successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}