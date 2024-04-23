import createChallengeModel from "../models/admin.challenge.model.js";
import challengeModel from "../models/user.challenge.model.js";
import { userModel } from "../models/user.model.js";
import {error,success} from  "../utills/responseWrapper.utill.js";


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

  
      const challengeInfo = new challengeModel({ user,startTime: startTime, endTime, name,
        taskamount:challengeDetails.taskamount,duration:challengeDetails.duration,status:"incomplete" });
      const createchallenges = await challengeInfo.save();

      currUser.challenges.push(createchallenges._id);
      await currUser.save(); 
      const response = {
        _id: createchallenges._id,
        name: createchallenges.name,
        startTime: createchallenges.startTime,
        status: createchallenges.status,
        user: createchallenges.user,
        taskamount : createchallenges.taskamount,
        duration: createchallenges.duration,
    };

    console.log(response)
  
      return res.send(success(200, "Challenge started successfully",response));
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
        const challengeInfo = await challengeModel.findOne({name});


        if (status === "complete") {
            // Assuming rewards is defined somewhere in your code
            currUser.INR += challengeDetails.rewards;
            currUser.challenges = currUser.challenges.filter(challengeId => challengeId.toString() !==challengeInfo._id.toString())
            await currUser.save();
          }

          const challengeDelete = await challengeModel.findOneAndDelete({name,user});
          if(!challengeDelete){
            return res.send(error(404,"No challenge have been played by you"));
          }
         challengeInfo.endTime = endTime;
          challengeInfo.status = status;
          await challengeInfo.delete();
          console.log("challenge deleted")
          await challengeInfo.save();
          return res.send(success(200,"challenge completed successfully"))
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
              status: challenges.status,
              duration: challenges.duration,
              taskamount: challenges.taskamount,
          };
          
      });
   console.log(challengesResponse)
         console.log(allChallenges);
        return res.send(success(200,allChallenges));
       

    } catch (err) {
        return res.send(error(500,err.message));
    }
}