"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    coords: {
        altitude: Number,
        altitudeAccuracy: Number,
        latitude: Number,
        accuracy: Number,
        longitude: Number,
        heading: Number,
        speed: Number,
    },
    timestamp: Date,
});
exports.userSchema = new mongoose_1.Schema({
    // TODO instead of text index, you should use search index
    username: { type: String, unique: true, index: 'text' },
    password: { type: String, unique: true, index: 1 },
    full_name: String,
    gender: String,
    birthdate: Date,
    mail: String,
    lastLogin: Date,
    phone: String,
    locations: [locationSchema],
    // TODO You should create a separate collection for user settings
    languagePreferences: [String],
    // TODO You should create a separate collection for user chats
    chats: [String],
});
exports.UserModel = (0, mongoose_1.model)('User', exports.userSchema);
//# sourceMappingURL=user.js.map