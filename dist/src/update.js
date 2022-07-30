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
const updateUser = (collection, username, userObject) => {
    return new Promise((fulfill, reject) => {
        collection.update({ "username": username }, { $set: userObject }, (err, updatedDoc) => {
            if (err) {
                reject();
            }
            else {
                fulfill({});
            }
        });
    });
};
exports.updateUser = updateUser;
const updatePassword = (collection, username, password) => {
    return new Promise((fulfill, reject) => {
        collection.update({ "username": username }, { $set: { password } }, (err, updatedDoc) => {
            if (err) {
                reject();
            }
            else {
                fulfill({});
            }
        });
    });
};
exports.updatePassword = updatePassword;
const updateCurrentLocation = (collection, username, location) => {
    return new Promise((fulfill, reject) => __awaiter(void 0, void 0, void 0, function* () {
        location.timestamp = new Date().toISOString();
        // TODO fidnandmdify is deprecated
        collection.findAndModify({ "username": username }, [], { $push: { "locations": location } }, (err, updatedDoc) => {
            if (err) {
                reject();
            }
            else {
                fulfill({});
            }
        });
    }));
};
exports.updateCurrentLocation = updateCurrentLocation;
//# sourceMappingURL=update.js.map