import ProgressAmount from "../models/progressamount.model.js";
import { userModel } from "../models/user.model.js";
import challengeModel from "../models/user.challenge.model.js";
import { error, success } from "../utills/responseWrapper.utill.js";
export async function postProgressAmountController(req, res) {
    try {
        const { userId, progressAmount } = req.body;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send(error(404, 'User not found'));
        }

        // Create a new progress amount entry
        const progressAmountEntry = new ProgressAmount({
            amount: progressAmount,
            user: user._id // Associate the progress amount with the user
        });

        // Save the progress amount entry
        const savedProgressAmount = await progressAmountEntry.save();

        return res.status(200).send(success(200, 'Progress amount stored successfully', savedProgressAmount));
    } catch (err) {
        return res.status(500).send(error(500, err.message));
    }
}

export async function resetProgressAmount(req, res) {
    try {
        const { userId} = req.body;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.send(error(404, "User not found"));
        }

        // Reset progress amount for the user and challenge
        let progressAmount = await ProgressAmount.findOne({ user: userId });
        if (progressAmount) {
            progressAmount.amount = 0;
            await progressAmount.save();
        }

        return res.status (200).send(success(200, "Progress amount reset successfully"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
}