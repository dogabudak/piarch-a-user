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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Router = require("koa-router");
var koa = require("koa");
var koaBody = require("koa-body");
var mongodb = require("mongodb");
var config = require("./config/config.json");
var MongoClient = mongodb.MongoClient;
var client = new MongoClient(config.mongo.url, { useNewUrlParser: true, useUnifiedTopology: true });
var collection;
client.connect().then(function () {
    var db = client.db('piarka');
    collection = db.collection('users');
});
var app = new koa();
var route = new Router();
app.listen(config.server.port);
app.use(route.routes())
    .use(route.allowedMethods());
// TODO token operations can be a middleware
route.post('/update-user', koaBody(), function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var body, token, userNameFromToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = ctx.request.body;
                token = ctx.request.header.authorize.split(' ')[1];
                userNameFromToken = getUserNameFromToken(token);
                /*
                //TODO uncomment when development is finished
                const isValidToken = await checkToken(token);
                if(!isValidToken){
                    return
                }
                */
                return [4 /*yield*/, updateUser(userNameFromToken, body.user)];
            case 1:
                /*
                //TODO uncomment when development is finished
                const isValidToken = await checkToken(token);
                if(!isValidToken){
                    return
                }
                */
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// TODO please refactor here and move these functions to a seperate location
route.post('/update-location', koaBody(), function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userNameFromToken, location;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = ctx.request.header.authorize.split(' ')[1];
                userNameFromToken = getUserNameFromToken(token);
                location = ctx.request.body.currentLocation;
                return [4 /*yield*/, updateCurrentLocation(userNameFromToken, location)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
route.get('/user', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userNameFromToken, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = ctx.request.header.authorize.split(' ')[1];
                userNameFromToken = getUserNameFromToken(token);
                return [4 /*yield*/, getUser(userNameFromToken)];
            case 1:
                user = _a.sent();
                ctx.body = user;
                return [2 /*return*/];
        }
    });
}); });
route.post('/signup', koaBody(), function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = ctx.request.body;
                /*
                //TODO uncomment when development is finished
                const isValidToken = await checkToken(token);
                if(!isValidToken){
                    return
                }
                */
                return [4 /*yield*/, registerUser(body.user)];
            case 1:
                /*
                //TODO uncomment when development is finished
                const isValidToken = await checkToken(token);
                if(!isValidToken){
                    return
                }
                */
                _a.sent();
                ctx.body = 'Token';
                return [2 /*return*/];
        }
    });
}); });
var getUser = function (username) {
    return new Promise(function (fulfill) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, collection.findOne({ "username": username })];
                case 1:
                    user = _a.sent();
                    // TODO use projection instead
                    delete user.locations;
                    fulfill(user);
                    return [2 /*return*/];
            }
        });
    }); });
};
var registerUser = function (user) {
    return new Promise(function (fulfill, reject) {
        var username = user.username, password = user.password;
        if (username.length < 3 || password.length < 3) {
            reject({ message: 'username or password too short' });
        }
        collection.find({ username: username }).toArray(function (err, reply) {
            if (!reply[0] && (!err)) {
                var data = { sub: username, iss: 'piarch_a' };
                var options = { algorithm: 'RS256', expiresIn: (10 * 60 * 60) };
                collection.insertMany([{ username: username, password: password }], function (err, reply) {
                    if (err) {
                        reject({ message: err });
                    }
                    else {
                        delete reply._id;
                        // TODO return a token
                        reply.token = 'TOKEN';
                        fulfill(reply);
                    }
                });
            }
            else {
                reject({ message: 'This user already exist' });
            }
        });
    });
};
var getUserNameFromToken = function (token) {
    var tokenArr = token.split('.');
    var tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
};
var updateCurrentLocation = function (username, location) {
    return new Promise(function (fulfill, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            location.timestamp = new Date().toISOString();
            // TODO fidnandmdify is deprecated
            collection.findAndModify({ "username": username }, [], { $push: { "locations": location } }, function (err, updatedDoc) {
                if (err) {
                    reject();
                }
                else {
                    fulfill({});
                }
            });
            return [2 /*return*/];
        });
    }); });
};
var updateUser = function (username, userObject) {
    return new Promise(function (fulfill, reject) {
        collection.update({ "username": username }, { $set: userObject }, function (err, updatedDoc) {
            if (err) {
                reject();
            }
            else {
                fulfill({});
            }
        });
    });
};
//# sourceMappingURL=index.js.map