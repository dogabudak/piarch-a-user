import * as Router from 'koa-router'
import * as koa from 'koa'
import * as koaBody from 'koa-body'
import * as mongodb from 'mongodb'
import {checkToken} from 'piarch-a-verification-plugin'
import * as config from './config/config.json';

const MongoClient = mongodb.MongoClient;
const client = new MongoClient(config.mongo.url, { useNewUrlParser: true,  useUnifiedTopology: true });
let collection;
client.connect().then(()=> {
    const db = client.db('piarka');
    collection = db.collection('users');
 });
const app = new koa();
const route = new Router();

app.listen(config.server.port);
app.use(route.routes())
    .use(route.allowedMethods());
// TODO token operations can be a middleware
route.post('/update-user',koaBody(), async (ctx) => {
    let body = ctx.request.body;
    const token = ctx.request.header.authorize.split(' ')[1]
    let userNameFromToken = getUserNameFromToken(token);
    /*
    //TODO uncomment when development is finished
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
    //TODO uncomment when development is finished
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
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    } 
    */
    const user = await getUser(userNameFromToken);
    ctx.body = user
});
route.post('/signup',koaBody(), async (ctx) => {
    const body = ctx.request.body
    /*
    //TODO uncomment when development is finished
    const isValidToken = await checkToken(token);
    if(!isValidToken){
        return
    }
    */
    await registerUser(body.user)
    ctx.body = 'Token'
});

const getUser = (username) => {
    return new Promise(async (fulfill) => {
        const user = await collection.findOne({"username": username});
        // TODO use projection instead
        delete user.locations
        fulfill(user)
    })
}
const registerUser = (user) => {
    return new Promise(function (fulfill, reject) {

            let {username, password} = user;
            if (username.length < 3 || password.length < 3) {
                reject({message: 'username or password too short'})
            }
            collection.find({username}).toArray((err, reply) => {
                if (!reply[0] && (!err)) {
                    const data = {sub: username, iss: 'piarch_a'};
                    const options = {algorithm: 'RS256', expiresIn: (10 * 60 * 60)};
                    collection.insertMany([{username, password}],  (err, reply) => {
                        if (err) {
                            reject({message: err})
                        } else {
                            delete reply._id
                            // TODO return a token
                            reply.token = 'TOKEN'
                            fulfill(reply)
                        }
                    });
                } else {
                    reject({message: 'This user already exist'})
                }
            })
    })
}
const getUserNameFromToken = (token) => {
        const tokenArr = token.split('.');
        const tokenClaims = Buffer.from(tokenArr[1], 'base64');
        return (JSON.parse(tokenClaims.toString())).sub;
} 
const updateCurrentLocation = (username, location) => {
    return new Promise(async (fulfill, reject) => {
        location.timestamp = new Date().toISOString();
        // TODO fidnandmdify is deprecated
                collection.findAndModify(
                    {"username": username},
                    [],
                    {$push: {"locations": location}},
                    (err, updatedDoc) => {
                        if (err){
                            reject()
                        } else {
                            fulfill({})
                        }
                    })
    })
}


const updateUser = (username, userObject) => {
    return new Promise((fulfill, reject) => {
                collection.update(
                    {"username": username},
                    {$set: userObject},
                    (err, updatedDoc) => {
                        if (err){
                            reject()
                        } else {
                            fulfill({})
                        }
                    })
    })
}
