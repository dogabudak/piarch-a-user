"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWithRetry = void 0;
const mongoose_1 = require("mongoose");
const fiveSeconds = 1000 * 60 * 2;
/**
 * A simple connection string with retry mechanism, for sake of the challenge, i did not think a more sophisticated approach is needed
 **/
const connectWithRetry = () => {
    return new Promise((resolve) => {
        (0, mongoose_1.connect)(process.env.MONGODB, function (err) {
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                setTimeout(exports.connectWithRetry, fiveSeconds);
            }
            else {
                resolve();
            }
        });
    });
};
exports.connectWithRetry = connectWithRetry;
//# sourceMappingURL=connect.js.map