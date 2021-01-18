const Router = require('koa-router');
const koa = require('koa');
const koaBody = require('koa-body');
const config = require('./resources/config.js');
const mongojs = require('mongojs');
const db = mongojs(config.mongo.url, ['users']);
const nano = require('nanomsg');
const nanoReq = nano.socket('req');

//TODO token check must be a plug-in

const app = new koa();
const route = new Router();

app.listen(config.server.port);
app.use(route.routes())
    .use(route.allowedMethods());

route.post('/update-user', (ctx) => {
    return updateUser(ctx).then((dataToReturn) => {
        ctx.body = dataToReturn;
    });
});


route.post('/update-location', koaBody(), (ctx) => {
    return updateCurrentLocation(ctx).then(() => {
        ctx.body = {};
    });
});

nanoReq.connect(config.verificationUrl);


const updateCurrentLocation = (context) => {
    //TODO  hande fullfill and rejected cases
    return new Promise((fulfill, reject) => {
        let body = context.request.body;
        let userLocation = body.currentLocation;

        userLocation.timestamp = new Date().toISOString();
        let token;
        let userNameFromToken;
        try {
            token = body.token;
            const tokenArr = token.split('.');
            const tokenClaims = new Buffer(tokenArr[1], 'base64');
            userNameFromToken = (JSON.parse(tokenClaims)).sub;
        } catch (err) {
            reject(err)
            //TODO handle error
        }
        nanoReq.send('jwt ' + token);
        nanoReq.on('data',  (buf) => {
            if (buf.toString() === 'true') {
                db.users.findAndModify({
                    query: {"username": userNameFromToken},
                    update: {$push: {"locations": userLocation}},
                    new: true
                }, (err, doc) => {
                    //TODO a return needed ?
                })
            }
        });
    })
}


const updateUser = (req) => {
    //TODO  hande fullfill and rejected cases
    return new Promise((fulfill, reject) => {
        try {
            const token = req.token;
            const tokenArr = token.split('.');
            const tokenClaims = new Buffer(tokenArr[1], 'base64');
            const userNameFromToken = (JSON.parse(tokenClaims)).sub;

        } catch (err) {
            //TODO handle error
        }
        nanoReq.send('jwt ' + token);
        nanoReq.on('data',  (buf) => {
            if (buf.toString() === 'true') {
                db.users.findAndModify({
                    query: {"username": userNameFromToken}
                    // ,update: { $set: { tag: 'maintainer' } }
                }, (err, doc, lastErrorObject) => {
                    console.log(err, doc, lastErrorObject)
                    //TODO a return needed ?
                })
            }
        });
    })
}
