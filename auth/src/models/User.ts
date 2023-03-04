
// 
//  mongoose Users module
// 



import mongoose from "mongoose";


const { Schema } = mongoose;

const userSchema = new Schema({
    email: String, 
    password: String,
    firstName: String,
    lastName: String,
    date: { type: Date, default: Date.now },
});

const User = mongoose.models['user'] || mongoose.model('user', userSchema);

export default User;