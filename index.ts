import 'dotenv/config'

import Fastify, {FastifyReply, FastifyRequest} from 'fastify'
import {getPublicUser, getUser, getUserFromEMail, getUserNameFromToken} from "./src/user";
import {updateCurrentLocation, updateUser} from "./src/update";
import {getChatsForUser} from "./src/message";
import {registerUser} from "./src/register";
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
interface ParamsType {
        email?: string // inserted in auth middleware
        username?: string // inserted in auth middleware
}

export const withPermitMiddleware = async (req: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) => {
        let username: string | undefined;
        try {
                const { headers: { authorize = '' }, body } = req;
                const token = (authorize as string).split(' ')[1]
                username = getUserNameFromToken(token)
                // TODO get rid of these ts-ognires
                req.body = {
                        username, token, ...body
                }
        }catch (e) {
                reply.code(403).send({ error: 'Forbidden' });
                return
        }
        if (!username) {
                reply.code(403).send({ error: 'Forbidden' });
                return
        }
};
fastify.addHook('preHandler', withPermitMiddleware)
//TODO add swagger documents to each endpoint
//TODO move these endpoints to a separate place
fastify.post('/update-user', async (req: FastifyRequest<{ Body: BodyType }>,  reply: FastifyReply) => {
        /*
        //TODO if its local dont check the token, assign a random username
        const isValidToken = await checkToken(token);
        if(!isValidToken){
            return
        }
         */
        await updateUser(req.body.username, req.body.user)
        reply.code(200).send();

});
fastify.post('/update-location', async (req: FastifyRequest<{ Body: BodyType }>) => {
        //TODO if its local dont check the token, assign a random username
        /*
        const isValidToken = await checkToken(token);
        if(!isValidToken){
            return
        }
         */
        const location = req.body.currentLocation;
        await updateCurrentLocation(req.body.username, location)
});
fastify.get('/user/chats',async (req: FastifyRequest<{ Body: BodyType }>) => {
        /*
        //TODO if there is no token just return
        const isValidToken = await checkToken(token);
        if(!isValidToken){
            return
        }
        */
        return await getChatsForUser(req.body.username)
});

// TODO move public routes to a separate place
fastify.get('/public-user/:userName',async (req: FastifyRequest<{ Body: BodyType, Params:ParamsType}>)=> {
       return getPublicUser(req.params.username)
});
fastify.post('/change-password/:email', async (req: FastifyRequest<{ Body: BodyType }>)=> {
        /*
        //TODO if its local dont check the token, assign a random username
        const isValidToken = await checkToken(token);
        if(!isValidToken){
            return
        }
         */
        await updateUser(req.body.username, req.body.password)
});
fastify.get('/forgot-password/:email', async (req: FastifyRequest<{ Body: BodyType, Params:ParamsType }>) => {
        const user = await getUserFromEMail(req.params.email);
        if (user) {
                // TODO send a mail to the user with a token link
                // TODO this link will token will open a web page to enter new password
        }
});
fastify.get('/user', async (req: FastifyRequest<{ Body: BodyType }>)=> {
        /*
        //TODO if its local dont check the token, assign a random username
        const isValidToken = await checkToken(token);
        if(!isValidToken){
            return
        }
         */
       return getUser(req.body.username)
});


fastify.post('/signup',  async (req: FastifyRequest<{ Body: BodyType }>) => {
        /*
        //TODO if its local dont check the token, assign a random username
         const isValidToken = await checkToken(token);
        if(!isValidToken){
            return
        }
         */
        await registerUser(req.body.user)
        return { message: 'User registered successfully' }
});
fastify.listen({ port: Number(process.env.PORT) }, (err, address) => {
        if (err) throw err
})
