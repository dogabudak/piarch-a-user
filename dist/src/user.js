"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNameFromToken = exports.getUserFromEMail = exports.getPublicUser = exports.getUser = void 0;
const user_1 = require("../db/model/user");
const getUser = (username) => {
    return user_1.UserModel.findOne({ username }, { locations: -1 });
};
exports.getUser = getUser;
const getPublicUser = (username) => {
    return user_1.UserModel.findOne({ username }, { username: 1, gender: 1, birthdate: 1 });
};
exports.getPublicUser = getPublicUser;
const getUserFromEMail = (mail) => {
    return user_1.UserModel.findOne({ mail }, { locations: -1 });
};
exports.getUserFromEMail = getUserFromEMail;
const getUserNameFromToken = (token) => {
    const tokenArr = token.split('.');
    const tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
};
exports.getUserNameFromToken = getUserNameFromToken;
//# sourceMappingURL=user.js.map