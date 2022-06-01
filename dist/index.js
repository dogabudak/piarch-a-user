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
const Router = require("koa-router");
const koa = require("koa");
const koaBody = require("koa-body");
const mongodb = require("mongodb");
require("dotenv/config");
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
let collection;
client.connect().then(() => {
    const db = client.db('piarka');
    collection = db.collection('users');
});
const app = new koa();
const route = new Router();
app.listen(process.env.PORT);
app.use(route.routes())
    .use(route.allowedMethods());
// TODO token operations can be a middleware
route.post('/update-user', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield updateUser(userNameFromToken, body.user);
}));
// TODO please refactor here and move these functions to a seperate location
route.post('/update-location', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const location = ctx.request.body.currentLocation;
    yield updateCurrentLocation(userNameFromToken, location);
}));
route.get('/user', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const user = yield getUser(userNameFromToken);
    ctx.body = user;
}));
route.post('/signup', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield registerUser(body.user);
    ctx.body = 'Token';
}));
const getUser = (username) => {
    return new Promise((fulfill) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield collection.findOne({ "username": username });
        // TODO use projection instead
        delete user.locations;
        fulfill(user);
    }));
};
const registerUser = (user) => {
    return new Promise(function (fulfill, reject) {
        let { username, password } = user;
        if (username.length < 3 || password.length < 3) {
            reject({ message: 'username or password too short' });
        }
        collection.find({ username }).toArray((err, reply) => {
            if (!reply[0] && (!err)) {
                const data = { sub: username, iss: 'piarch_a' };
                const options = { algorithm: 'RS256', expiresIn: (10 * 60 * 60) };
                collection.insertMany([{ username, password }], (err, reply) => {
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
const getUserNameFromToken = (token) => {
    const tokenArr = token.split('.');
    const tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
};
const updateCurrentLocation = (username, location) => {
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
const updateUser = (username, userObject) => {
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
//# sourceMappingURL=index.js.map