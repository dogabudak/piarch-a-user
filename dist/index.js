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
let collection;
// TODO this can handled better
// TODO use mongoose, that will help a lot here
connect_1.connectWithRetry().then((connectionInstance) => {
    collection = connectionInstance;
});
// TODO token operations can be a middleware
route.post('/update-user', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield update_1.updateUser(collection, userNameFromToken, body.user);
}));
// TODO please refactor here and move these functions to a seperate location
route.post('/update-location', koaBody(), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const location = ctx.request.body.currentLocation;
    yield update_1.updateCurrentLocation(collection, userNameFromToken, location);
}));
route.get('/user', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.request.header.authorize.split(' ')[1];
    let userNameFromToken = user_1.getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const user = yield user_1.getUser(collection, userNameFromToken);
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
    yield register_1.registerUser(collection, body.user);
    ctx.body = 'Token';
}));
route.get('/forgot-password/:email', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.getUser(collection, ctx.params.email);
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
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    yield update_1.updateUser(collection, userNameFromToken, body.password);
}));
//# sourceMappingURL=index.js.map