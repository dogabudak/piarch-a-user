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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPermitMiddleware = void 0;
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const user_1 = require("./src/user");
const update_1 = require("./src/update");
const message_1 = require("./src/message");
const register_1 = require("./src/register");
const fastify = (0, fastify_1.default)({
    logger: true
});
const withPermitMiddleware = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    let username;
    try {
        const { headers: { authorize = '' }, body } = req;
        const token = authorize.split(' ')[1];
        username = (0, user_1.getUserNameFromToken)(token);
        // TODO get rid of these ts-ognires
        req.body = Object.assign({ username, token }, body);
    }
    catch (e) {
        reply.code(403).send({ error: 'Forbidden' });
        return;
    }
    if (!username) {
        reply.code(403).send({ error: 'Forbidden' });
        return;
    }
});
exports.withPermitMiddleware = withPermitMiddleware;
fastify.addHook('preHandler', exports.withPermitMiddleware);
//TODO move these endpoints to a separate place
fastify.post('/update-user', (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
     */
    yield (0, update_1.updateUser)(req.body.username, req.body.user);
    reply.code(200).send();
}));
fastify.post('/update-location', (req) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO if its local dont check the token, assign a random username
    /*
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
     */
    const location = req.body.currentLocation;
    yield (0, update_1.updateCurrentLocation)(req.body.username, location);
}));
fastify.get('/user/chats', (req) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if there is no token just return
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    return yield (0, message_1.getChatsForUser)(req.body.username);
}));
// TODO move public routes to a separate place
fastify.get('/public-user/:userName', (req) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, user_1.getPublicUser)(req.params.username);
}));
fastify.post('/change-password/:email', (req) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
     */
    yield (0, update_1.updateUser)(req.body.username, req.body.password);
}));
fastify.get('/forgot-password/:email', (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.getUserFromEMail)(req.params.email);
    if (user) {
        // TODO send a mail to the user with a token link
        // TODO this link will token will open a web page to enter new password
    }
}));
fastify.get('/user', (req) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
     */
    return (0, user_1.getUser)(req.body.username);
}));
fastify.post('/signup', (req) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    //TODO if its local dont check the token, assign a random username
     const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
     */
    yield (0, register_1.registerUser)(req.body.user);
    return { message: 'User registered successfully' };
}));
fastify.listen({ port: Number(process.env.PORT) }, (err, address) => {
    if (err)
        throw err;
});
//# sourceMappingURL=index.js.map