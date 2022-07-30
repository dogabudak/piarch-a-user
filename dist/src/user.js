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
exports.getUserNameFromToken = exports.getUser = void 0;
const getUser = (collection, username) => {
    return new Promise((fulfill) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield collection.findOne({ "username": username });
        // TODO use projection instead
        delete user.locations;
        fulfill(user);
    }));
};
exports.getUser = getUser;
const getUserNameFromToken = (token) => {
    const tokenArr = token.split('.');
    const tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
};
exports.getUserNameFromToken = getUserNameFromToken;
//# sourceMappingURL=user.js.map