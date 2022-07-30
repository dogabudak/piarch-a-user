import 'dotenv/config'

import * as Router from 'koa-router'
import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import {checkToken} from 'piarch-a-verification-plugin'

import {updateCurrentLocation, updateUser} from "./src/update";
import {registerUser} from "./src/register";
import {getUser, getUserNameFromToken} from "./src/user";
import {connectWithRetry} from "./db/connect";

const app = new Koa();
const route = new Router();

app.listen(process.env.PORT);
app.use(route.routes())
    .use(route.allowedMethods());
let collection
// TODO this can handled better
// TODO use mongoose, that will help a lot here
connectWithRetry().then((connectionInstance) => {
        collection = connectionInstance
    }
)

// TODO token operations can be a middleware
route.post('/update-user', koaBody(), async (ctx) => {
    let body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1]
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    await updateUser(collection, userNameFromToken, body.user)
});
// TODO please refactor here and move these functions to a seperate location
route.post('/update-location', koaBody(), async (ctx) => {
    const token = ctx.request.header.authorize.split(' ')[1]
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const location = ctx.request.body.currentLocation;
    await updateCurrentLocation(collection, userNameFromToken, location)
});

route.get('/user', async (ctx) => {
    const token = ctx.request.header.authorize.split(' ')[1]
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const user = await getUser(collection, userNameFromToken);
    ctx.body = user
});
route.post('/signup', koaBody(), async (ctx) => {
    const body = ctx.request.body
    /*
    //TODO if its local dont check the token, assign a random username
     const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    await registerUser(collection, body.user)
    ctx.body = 'Token'
});
route.get('/forgot-password/:email', async (ctx) => {
    const user = await getUser(collection, ctx.params.email);
    if (user) {
        // TODO send a mail to the user with a token link
        // TODO this link will token will open a web page to enter new password
    }
});

route.post('/change-password/:email', koaBody(), async (ctx) => {
    const body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1]
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    await updateUser(collection, userNameFromToken, body.password)
});

