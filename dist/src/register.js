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
exports.registerUser = void 0;
const user_1 = require("../db/model/user");
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = user;
    if (username.length < 3 || password.length < 3) {
        return { message: 'username or password too short' };
    }
    // TODO you can fix this via unique token or something
    const reply = yield user_1.UserModel.findOne({ username });
    if (!reply) {
        const data = { sub: username, iss: 'piarch_a' };
        const options = { algorithm: 'RS256', expiresIn: (10 * 60 * 60) };
        yield user_1.UserModel.insertMany([{ username, password }]);
        // TODO return a real token
        return 'TOKEN';
    }
    else {
        return { message: 'This user already exist' };
    }
});
exports.registerUser = registerUser;
//# sourceMappingURL=register.js.map