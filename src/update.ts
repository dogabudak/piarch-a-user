import {UserModel} from "../db/model/user";

export const updateUser = async (username, userObject) => {
   await UserModel.where({"username": username}).updateOne(userObject)

}
export const updatePassword = async (username, password) => {
    await UserModel.updateOne({"username": username},{ password})
}
export const updateCurrentLocation = async (username, location) => {
    location.timestamp = new Date().toISOString();
    await UserModel.updateOne({"username": username},  {$push: {"locations": {$each: [location], $slice: -10}}})
}
