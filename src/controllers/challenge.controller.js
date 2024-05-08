import createChallengeModel from "../models/admin.challenge.model.js";
import challengeModel from "../models/user.challenge.model.js";
import { userModel } from "../models/user.model.js";
import {error,success} from  "../utills/responseWrapper.utill.js";
import CompletedChallenge from "../models/completedChallenge.js";
import {generateUniqueReferenceId } from '../services/generateRefrenceid.js';
export async function insertChallengeController(req, res) {
    try {
      const user= req._id;
      const { name } = req.body;
  
      const currUser = await userModel.findById(user);
      if (!currUser) {
        return res.send(error(404, 'User not found'));
      }
      const activeChallenge = await challengeModel.findOne({user, status:"incomplete"})
      if(activeChallenge){
        return res.send(error(400, 'You already have an active challenge'));
      }
      
      const challengeDetails = await createChallengeModel.findOne({ name });
      if (!challengeDetails) {
        return res.send(error(404, 'Challenge not found'));
      }
  
      if (!challengeDetails.isActive) {
        return res.send(error(400, 'Challenge is not active'));
      }
      const now = new Date(); 
    const utcOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(now.getTime() + utcOffset); 

    // Create startTime and endTime based on IST
    const startTime = istTime;
    const endTime = new Date(startTime.getTime() + challengeDetails.duration);

    // const referenceId = generateUniqueReferenceId();

    const challengeInfo = new challengeModel({
        user,
        startTime,
        endTime,
        name,
        rewards: challengeDetails.rewards,
        taskamount: challengeDetails.taskamount,
        duration: challengeDetails.duration,
        status: "incomplete",
        referenceId: challengeDetails.referenceId // Include the referenceId
    });
    const createchallenges = await challengeInfo.save();

    currUser.challenges.push({ challengeId: createchallenges._id, referenceId: challengeDetails.referenceId}); // Include referenceId in the user's challenges array
    await currUser.save();

    const response = {
        _id: createchallenges._id,
        name: createchallenges.name,
        startTime: createchallenges.startTime,
        status: createchallenges.status,
        user: createchallenges.user,
        rewards: createchallenges.rewards,
        taskamount: createchallenges.taskamount,
        duration: createchallenges.duration,
        referenceId:challengeDetails.referenceId 
    };

    return res.send(success(200, "Challenge started successfully", response));
} catch (err) {
    return res.send(error(500, err.message));
}
}

export async function updateChallengeController(req,res){
    try {

        const user = req._id;
        const {name ,status} = req.body;
        const currUser = await userModel.findById(user);
      if (!currUser) {
        return res.send(error(404, 'User not found'));
      }

        const challengeDetails = await createChallengeModel.findOne({ name });
        console.log(challengeDetails)
        const challengeInfo = await challengeModel.findOne({name,user});
        if(!challengeInfo){
          return res.send(error(404,"No challenge Found"));
        }
    
        const existingChallenge = await challengeModel.findOne({name,user});
        if (!existingChallenge) {
          return res.send(error(400, "No Challenge Found for this user exists"));
        }

        if (status === "complete" && challengeInfo.status !=='complete'){ {
            currUser.INR += challengeDetails.rewards;
            // currUser.challenges = currUser.challenges.filter(challengeId => challengeId.toString() !==challengeInfo._id.toString())
            await currUser.save();

            const completedChallenge = new CompletedChallenge({
              user:user,
              challenge: challengeInfo._id,
             status:status,
             referenceId:challengeInfo.referenceId
            })
            console.log(completedChallenge)
            await completedChallenge.save();
          }

          existingChallenge.status = status
          await existingChallenge.save();

    await challengeModel.findOneAndDelete({name,user});

          return res.send(success(200,"challenge completed successfully"))
        }
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
export async function getAllChallengesController(req,res){
    try {
      if(!req._id){
        return 
      }
        const user = req._id;
        const currUser = await userModel.findById(user);
        if (!currUser) {
            return res.send(error(404,'User does not exist!'));
          }

        const completedChallenges = await challengeModel.find({user})

        const ongoingChallenges = await challengeModel.find({user, remainingTime:{$gt: 0}})

        const allChallenges = [...completedChallenges,...ongoingChallenges]

      if(allChallenges.length === 0) {
        return res.send(error(404,"no challenge have been played by you"));
      }
      console.log(allChallenges)
      
        const challengesResponse = allChallenges.map(challenges => {
          return {
              _id: challenges._id,
              name: challenges.name,
              startTime: challenges.startTime,
              remainingTime: challenges.remainingTime,
              rewards: challenges.rewards,
              status: challenges.status,
              duration: challenges.duration,
              taskamount: challenges.taskamount,
              referenceId:challenges.referenceId
          };
          
      });
   console.log(challengesResponse)
         console.log(allChallenges);
        return res.send(success(200,allChallenges));
       

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function getCompletedChallengesController(req,res){
  try {
    const user = req._id

    const completedchallenges = await CompletedChallenge.find({user,status:'complete'}).populate('challenge')

    if(completedchallenges.length ===0){
      return res.send(error(404,'No Completed Challenges Found',[]))
    }
    return res.send(success(200,'Completed Challenges',completedchallenges))
  }catch (err){
    return res.send(error(500,err.message));
  }
}