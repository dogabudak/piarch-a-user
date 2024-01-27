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
const koa_body_1 = require("koa-body");
const update_1 = require("./src/update");
const register_1 = require("./src/register");
const user_1 = require("./src/user");
const connect_1 = require("./db/connect");
const message_1 = require("./src/message");
const app = new Koa();
const route = new Router();
app.listen(process.env.PORT);
app.use(route.routes())
    .use(route.allowedMethods())
    .use((0, koa_body_1.koaBody)())
    .use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.extras = {};
    let body = ctx.request.body;
    ctx.extras.token = ctx.request.header.authorize.split(' ')[1];
    ctx.extras.user = body.user;
    ctx.extras.username = (0, user_1.getUserNameFromToken)(ctx.extras.token);
    yield next();
}));
(0, connect_1.connectWithRetry)();
route.post('/update-user', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield (0, update_1.updateUser)(ctx.extras.username, ctx.extras.user);
}));
route.post('/update-location', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const location = ctx.request.body.currentLocation;
    yield (0, update_1.updateCurrentLocation)(ctx.extras.username, location);
}));
route.get('/user/chats', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if there is no token just return
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    ctx.body = yield (0, message_1.getChatsForUser)(ctx.extras.username);
}));
route.get('/user', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    ctx.body = yield (0, user_1.getUser)(ctx.extras.username);
}));
route.post('/signup', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    /*
    //TODO if its local dont check the token, assign a random username
     const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield (0, register_1.registerUser)(body.user);
    ctx.body = 'Token';
}));
route.get('/forgot-password/:email', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.getUserFromEMail)(ctx.params.email);
    if (user) {
        // TODO send a mail to the user with a token link
        // TODO this link will token will open a web page to enter new password
    }
}));
route.post('/change-password/:email', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield (0, update_1.updateUser)(ctx.extras.username, body.password);
}));
// TODO move public routes to a separate place
route.get('/public-user/:userName', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield (0, user_1.getPublicUser)(ctx.params.userName);
}));
//# sourceMappingURL=index.js.map