import {UserModel} from "../db/model/user";

export const getUser = (username) => {
    return UserModel.findOne({username}, {locations: -1})
}
//TODO add pagination like limit and skip
// TODO this is not working
export const getUsers = (searchString: string) => {
    return UserModel.find({username: {$regex: searchString, $options: 'i'}}, {locations: 0})
        .skip(0)
        .limit(10)
}
export const getPublicUser = (username) => {
    return UserModel.findOne({username}, {username: 1, gender: 1, birthdate: 1})
}
export const getUserFromEMail = (mail) => {
    return UserModel.findOne({mail}, {locations: 0})
}

export const getUserNameFromToken = (token) => {
    const tokenArr = token.split('.');
    const tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
}
