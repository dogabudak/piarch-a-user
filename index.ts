import * as Router from 'koa-router'
import * as koa from 'koa'
import * as koaBody from 'koa-body'
import * as mongodb from 'mongodb'
import {checkToken} from 'piarch-a-verification-plugin'
import {logger} from 'piarch-a-logger'
import * as config from './config/config.json';

const MongoClient = mongodb.MongoClient;
const client = new MongoClient(config.mongo.url, { useNewUrlParser: true });

const app = new koa();
const route = new Router();

app.listen(config.server.port);
app.use(route.routes())
    .use(route.allowedMethods());

route.post('/update-user',koaBody(), async (ctx) => {
    await updateUser(ctx)
});

route.post('/update-location', koaBody(), async (ctx) => {
    await updateCurrentLocation(ctx)
});

const updateCurrentLocation = (context) => {
    return new Promise(async (fulfill, reject) => {
        let body = context.request.body;
        let userLocation = body.currentLocation;
        userLocation.timestamp = new Date().toISOString();
        let token;
        let userNameFromToken;
        try {
            token = body.token;
            const tokenArr = token.split('.');
            const tokenClaims = new Buffer(tokenArr[1], 'base64');
            //TODO remove this unknown conversion
            userNameFromToken = (JSON.parse(tokenClaims as unknown as string)).sub;
        } catch (err) {
            logger.info(err)
            reject(err)
        }
        const isValidToken = await checkToken(token)
        if(isValidToken){
            client.connect(() => {
                const collection = client.db("piarka").collection("users");
                collection.findAndModify(
                    {"username": userNameFromToken},
                    [],
                    {$push: {"locations": userLocation}},
                    (err, updatedDoc) => {
                        if (err){
                            logger.info(err)
                            reject()
                        } else {
                            fulfill({})
                        }
                    })
            })
        }
    })
}


const updateUser = (context) => {
    return new Promise((fulfill, reject) => {
        const token = context.request.body.token;
        let userNameFromToken;
        try {
          const tokenArr = token.split('.');
          const tokenClaims = new Buffer(tokenArr[1], 'base64');
          //TODO remove this unknown conversion
          userNameFromToken = (JSON.parse(tokenClaims as unknown as string)).sub;
        } catch (err) {
            logger.info(err)
          reject()
        }
        const isValidToken = checkToken(token)
        if(isValidToken){
            client.connect(err => {
                const collection = client.db("piarka").collection("users");
                collection.update(
                    {"username": userNameFromToken},
                    {$set: context.request.body.user },
                    (err, updatedDoc) => {
                        if (err){
                            logger.info(err)
                            reject()
                        } else {
                            fulfill({})
                        }
                    })
            })
        }
    })
}
