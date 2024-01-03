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
    username: { type: String, unique: true, index: true },
    password: { type: String, unique: true, index: true },
    full_name: String,
    gender: String,
    birthdate: Date,
    mail: String,
    lastLogin: Date,
    phone: String,
    locations: [locationSchema],
    languagePreferences: [String],
    chats: [String],
});
exports.UserModel = (0, mongoose_1.model)('User', exports.userSchema);
//# sourceMappingURL=user.js.map