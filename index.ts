import 'dotenv/config'

import * as Router from 'koa-router'
import * as Koa from 'koa'

import { koaBody } from 'koa-body'
import {updateCurrentLocation, updateUser} from "./src/update";
import {registerUser} from "./src/register";
import {getPublicUser, getUser, getUserFromEMail, getUserNameFromToken} from "./src/user";
import {connectWithRetry} from "./db/connect";
import {getChatsForUser} from "./src/message";

const app = new Koa();
const route = new Router();

app.listen(process.env.PORT);
app.use(route.routes())
    .use(route.allowedMethods())
    .use(koaBody())
    .use(async (ctx, next) => {
        ctx.extras ={}
        let body = ctx.request.body;
        ctx.extras.token = (ctx.request.header.authorize as string).split(' ')[1]
        ctx.extras.user = body.user
        ctx.extras.username = getUserNameFromToken(ctx.extras.token);
        await next()
})

connectWithRetry()

route.post('/update-user', async (ctx) => {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    await updateUser(ctx.extras.username, ctx.extras.user)
});
route.post('/update-location',  async (ctx) => {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    const location = ctx.request.body.currentLocation;
    await updateCurrentLocation(ctx.extras.username , location)
});

route.get('/user/chats', async (ctx) => {
    /*
    //TODO if there is no token just return
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    ctx.body = await getChatsForUser(ctx.extras.username )
});

route.get('/user', async (ctx) => {
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    ctx.body = await getUser(ctx.extras.username )
});

route.post('/signup',  async (ctx) => {
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

route.post('/change-password/:email',  async (ctx) => {
    const body = ctx.request.body;
    /*
    //TODO if its local dont check the token, assign a random username
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    await updateUser(ctx.extras.username , body.password)
});

// TODO move public routes to a separate place
route.get('/public-user/:userName', async (ctx) => {
    ctx.body = await getPublicUser(ctx.params.userName)
});
