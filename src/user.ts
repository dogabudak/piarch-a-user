import {UserModel} from "../db/model/user";

export const getUser = (username) => {
    return UserModel.findOne({username}, {locations: -1})
}
export const getUserFromEMail = (mail) => {
    return UserModel.findOne({mail}, {locations: -1})
}

export const getUserNameFromToken = (token) => {
    const tokenArr = token.split('.');
    const tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
}
