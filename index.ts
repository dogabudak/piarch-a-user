import 'dotenv/config'

import * as Router from 'koa-router'
import * as Koa from 'koa'
import * as koaBody from 'koa-body'

import {updateCurrentLocation, updateUser} from "./src/update";
import {registerUser} from "./src/register";
import {getPublicUser, getUser, getUserFromEMail, getUserNameFromToken} from "./src/user";
import {connectWithRetry} from "./db/connect";

const app = new Koa();
const route = new Router();

app.listen(process.env.PORT);
app.use(route.routes())
    .use(route.allowedMethods());

connectWithRetry()

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
    await updateUser(userNameFromToken, body.user)
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
    await updateCurrentLocation(userNameFromToken, location)
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
    ctx.body = await getUser(userNameFromToken)
});
route.get('/public-user/:userName', async (ctx) => {
    const user = await getPublicUser(ctx.params.userName)
    console.log(user)
    ctx.body =user
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
    await registerUser(body.user)
    ctx.body = 'Token'
});
route.get('/forgot-password/:email', async (ctx) => {
    const user = await getUserFromEMail(ctx.params.email);
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
    await updateUser( userNameFromToken, body.password)
});

