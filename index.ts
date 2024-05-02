import 'dotenv/config'

import Fastify, {FastifyReply, FastifyRequest} from 'fastify'
import {
    getClosestUsers,
    getPublicUser,
    getUser,
    getUserFromEMail,
    getUserLocation,
    getUserNameFromToken,
    getUsers
} from "./src/user";
import {updateCurrentLocation, updateUser} from "./src/update";
import {getChatsForUser} from "./src/message";
import {registerUser} from "./src/register";
import {connectWithRetry} from "./db/connect";

const fastify = Fastify({
    logger: true
})

interface BodyType {
    currentLocation?: string // needed when we update curent location of the user
    user?: string // if we update the user
    password?: string // if we update the password
    username?: string // inserted in auth middleware
    token?: string // inserted in auth middleware
}

interface QueryType {
    email?: string // inserted in auth middleware
    username?: string // inserted in auth middleware
    searchString?: string
}

connectWithRetry().then(()=>{
    console.log('connected to db')
})

export const withPermitMiddleware = async (req: FastifyRequest<{
    Body: BodyType,
    Querystring: QueryType
}>, reply: FastifyReply) => {
    let username: string | undefined;
    //TODO if its local dont check the token, assign a random username
    //TODO if token neccesary enforce it, if not just check/skip it.
    if (process.env.ENV === 'local') {
        return req
    }
    try {
        const {headers: {authorize = ''}, body} = req;
        const token = (authorize as string).split(' ')[1]
        username = getUserNameFromToken(token)
        req.body = {
            username, token, ...body
        }
    } catch (e) {
        reply.code(403).send({error: 'Forbidden'});
        return
    }
    if (!username) {
        reply.code(403).send({error: 'Forbidden'});
        return
    }
};
fastify.addHook('preHandler', withPermitMiddleware)
//TODO add swagger documents to each endpoint
//TODO move these endpoints to a separate place
fastify.post('/update-user', async (req: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
    await updateUser(req.body.username, req.body.user)
    reply.code(200).send();

});
fastify.post('/update-location', async (req: FastifyRequest<{ Body: BodyType }>) => {
    const location = req.body.currentLocation;
    await updateCurrentLocation(req.body.username, location)
});
fastify.get('/user/chats', async (req: FastifyRequest<{ Body: BodyType }>) => {
    return await getChatsForUser(req.body.username)
});

// TODO move public routes to a separate place
fastify.get('/public-user/:userName', async (req: FastifyRequest<{ Body: BodyType, Querystring: QueryType }>) => {
    return getPublicUser(req.query.username as string)
});
fastify.post('/change-password/:email', async (req: FastifyRequest<{ Body: BodyType }>) => {
    await updateUser(req.body.username, req.body.password)
});
fastify.get('/forgot-password/:email', async (req: FastifyRequest<{ Body: BodyType, Querystring: QueryType }>) => {
    const user = await getUserFromEMail(req.query.email as string);
    if (user) {
        // TODO send a mail to the user with a token link
        // TODO this link will token will open a web page to enter new password
    }
});
fastify.get('/user', async (req: FastifyRequest<{ Body: BodyType }>) => {
    return getUser(req.body.username)
});

fastify.get('/user/search', async (req: FastifyRequest<{ Body: BodyType, Querystring: QueryType }>) => {
    return getUsers(req.query.searchString as string)
});

fastify.get('/user/search/closestUsers', async (req: FastifyRequest<{ Body: BodyType, Querystring: QueryType }>) => {
    const location = await getUserLocation(req.body.username)
    if(!location){
        return {error: 'User not found'}
    }
    // @ts-ignore
    const {altitude , longitude}= location.locations[0].coords
    return getClosestUsers(altitude , longitude)
});

fastify.post('/signup', async (req: FastifyRequest<{ Body: BodyType }>) => {
    await registerUser(req.body.user)
    return {message: 'User registered successfully'}
});
fastify.listen({port: Number(process.env.PORT)}, (err, address) => {
    if (err) throw err
})
