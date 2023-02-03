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
require("dotenv/config");
const Router = require("koa-router");
const Koa = require("koa");
const koaBody = require("koa-body");
const update_1 = require("./src/update");
const register_1 = require("./src/register");
const user_1 = require("./src/user");
const connect_1 = require("./db/connect");
const app = new Koa();
const route = new Router();
app.listen(process.env.PORT);
app.use(route.routes())
    .use(route.allowedMethods());
connect_1.connectWithRetry();
// TODO token operations can be a middleware
route.post('/update-user', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield update_1.updateUser(userNameFromToken, body.user);
}));
// TODO please refactor here and move these functions to a seperate location
route.post('/update-location', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const location = ctx.request.body.currentLocation;
    yield update_1.updateCurrentLocation(userNameFromToken, location);
}));
route.get('/user', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    ctx.body = yield user_1.getUser(userNameFromToken);
}));
route.get('/public-user/:userName', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.getPublicUser(ctx.params.userName);
    console.log(user);
    ctx.body = user;
}));
route.post('/signup', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    /*
    //TODO if its local dont check the token, assign a random username
     const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield register_1.registerUser(body.user);
    ctx.body = 'Token';
}));
route.get('/forgot-password/:email', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.getUserFromEMail(ctx.params.email);
    if (user) {
        // TODO send a mail to the user with a token link
        // TODO this link will token will open a web page to enter new password
    }
}));
route.post('/change-password/:email', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield update_1.updateUser(userNameFromToken, body.password);
}));
//# sourceMappingURL=index.js.map