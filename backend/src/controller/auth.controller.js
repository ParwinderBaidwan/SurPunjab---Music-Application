import { User } from '../models/user.model.js';

export const  authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        // check if user already exists
        const user = await User.findOne({clearkId: id});

        if(!user){
            // sign up
            await User.create({
                clearkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            });
        }

        res.status(200).json({success: true});
        // res.status(200).json({message: 'User signed in successfully'});
    } catch (error) {
        console.log("Error in auth callback",error);
        // res.status(500).json({message: 'Internal server error', error});
        next(error);
    }
}