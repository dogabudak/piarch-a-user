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
exports.connectWithRetry = void 0;
const mongodb = require("mongodb");
const fiveSeconds = 1000 * 60 * 2;
/**
 * A simple connection string with retry mechanism, for sake of the challenge, i did not think a more sophisticated approach is needed
 **/
const connectWithRetry = () => __awaiter(void 0, void 0, void 0, function* () {
    const MongoClient = mongodb.MongoClient;
    const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        const connection = yield client.connect();
        const db = connection.db('piarka');
        return db.collection('users');
    }
    catch (e) {
        console.error('Failed to connect to mongo on startup - retrying in 5 sec', e);
        setTimeout(exports.connectWithRetry, fiveSeconds);
    }
});
exports.connectWithRetry = connectWithRetry;
//# sourceMappingURL=connect.js.map