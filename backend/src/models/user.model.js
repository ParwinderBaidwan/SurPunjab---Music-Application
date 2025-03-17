import mongoose, { mongo } from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,   // createdAt, updatedAt
});


// clerk is used for authenticating users when someone authenticates with the clerk we need to take that user and save it into our mongodb database.
// We always need track ID if we are using any third party authentication service.

export const User = mongoose.model('User', userSchema);