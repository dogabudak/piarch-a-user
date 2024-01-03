"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentLocation = exports.updatePassword = exports.updateUser = void 0;
const user_1 = require("../db/model/user");
const updateUser = (username, userObject) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.where({ "username": username }).updateOne(userObject);
});
exports.updateUser = updateUser;
const updatePassword = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.updateOne({ "username": username }, { password });
});
exports.updatePassword = updatePassword;
const updateCurrentLocation = (username, location) => __awaiter(void 0, void 0, void 0, function* () {
    location.timestamp = new Date().toISOString();
    yield user_1.UserModel.updateOne({ "username": username }, { $push: { "locations": { $each: [location], $slice: -10 } } });
});
exports.updateCurrentLocation = updateCurrentLocation;
//# sourceMappingURL=update.js.map