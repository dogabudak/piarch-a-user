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
exports.getChatroom = exports.getChatsForUser = void 0;
const message_1 = require("../db/model/message");
const user_1 = require("../db/model/user");
const getChatsForUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.UserModel.findOne({ username }, { chats: 1 });
    if (users.chats.length) {
        const chatArray = [];
        for (const chatId of users.chats) {
            chatArray.push(yield (0, exports.getChatroom)(chatId));
        }
        return chatArray;
    }
    return null;
});
exports.getChatsForUser = getChatsForUser;
const getChatroom = (chatRoomId) => __awaiter(void 0, void 0, void 0, function* () {
    return message_1.ChatModel.findOne({ chatId: chatRoomId }, { _id: -1 });
});
exports.getChatroom = getChatroom;
//# sourceMappingURL=message.js.map