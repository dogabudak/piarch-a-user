"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const chatsSchema = new mongoose_1.Schema({
    chatId: String,
    messages: [{
            sender: String,
            recipient: String,
            message: String,
            timestamp: Date
        }]
});
exports.ChatModel = (0, mongoose_1.model)('Chat', chatsSchema);
//# sourceMappingURL=message.js.map