import User from "../models/User";
import Location from "../models/Location";
import Comment from "../models/Comment";
import { compare } from "bcrypt";


//  check for user existance
export const checkUserExist = async (email: string) => {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
        return true;
    }
    return false;
};

export const findOneUser = async (email: string) => {
    const user = await User.findOne({ email: email }).exec();
    return user;
};


export const verifyPassword = async (password: string, hashedPassword: string) => {
    const isValid = await compare(password, hashedPassword);
    return isValid;
};

export const getAllLocations = async () => {
    const res = await Location.find().lean();
    var locations = res.map((location) => ({
        id: location._id.toString(),
        name: location.name,
        price: location.price,
        location: location.location,
        description: location.description,
    }));
    return locations;
};

export const getLocationById = async (id: string) => {
    const location = await Location.findOne({ _id: id }).exec();
    return location;
};
// @ts-ignore
export const updateLocationById = async (id: string, updatedLocation) => {
    const response = Location.findByIdAndUpdate(id, updatedLocation);
    return response;
};


export const deleteLocationById = async (id: string) => {
    const response = await Location.deleteOne({ _id: id });
    return response;
};

export const getCommentsByLocationId = async(id: string) => { 
       
    // const commentsObj = await Location.findOne({ _id: id }).populate("comments").exec();
    // return commentsObj;


   const comments = await Location.findOne({
        _id: id
    }).
    populate({
        path: 'comments',
        model: Comment,
        populate: {
            path: 'author',
        model: User

        }
    });


    return(comments.comments);
   
}