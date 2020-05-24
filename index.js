const Router = require('koa-router'),
koa = require('koa'),
koaBody = require('koa-body'),
config = require('./resources/config.js'),
mongojs = require('mongojs'),
db = mongojs(config.mongo.url, ['users']),
nano = require('nanomsg'),
nanoReq = nano.socket('req');

//TODO token check must be a plug-in

var app = new koa();
const route = new Router();

app.listen(config.server.port);
app.use(route.routes())
   .use(route.allowedMethods());
route.post('/update-user',function (ctx) {
  return updateUserFunction(ctx).then(function(dataToReturn) {
    ctx.body = dataToReturn;
  });
});


route.post('/update-location',koaBody(), function (ctx){
  return updateCurrentLocation(ctx).then(function(dataToReturn) {
    ctx.body = {};
  });
});

nanoReq.connect(config.verificationUrl);


function updateCurrentLocation(context) {
  return new Promise(function (fulfill, reject) {
  let body = context.request.body;
  let userLocation = body.currentLocation;

  userLocation.timestamp = new Date().toISOString();
  let token ;
  let userNameFromToken;
  try{
    token = body.token,
    tokenArr = token.split('.'),
    tokenClaims = new Buffer(tokenArr[1],'base64'),
    userNameFromToken = (JSON.parse(tokenClaims)).sub;
  } catch (err){
    //TODO handle error
  }
  nanoReq.send('jwt '+ token);
  nanoReq.on('data', function (buf) {
    if (buf.toString() === 'true'){
      db.users.findAndModify({
    	query: { "username": userNameFromToken },
    	update: { $push: { "locations": userLocation } },
       new: true
      }, function (err, doc) {
  //TODO a return needed ?
    })}
  });


  })
}


function updateUserFunction(req) {
  return new Promise(function (fulfill, reject) {
    try{
      let token = req.token,
      tokenArr = token.split('.'),
      tokenClaims = new Buffer(tokenArr[1],'base64'),
      userNameFromToken = (JSON.parse(tokenClaims)).sub;

    } catch (err){
      //TODO handle error
    }
    nanoReq.send('jwt '+token);
    nanoReq.on('data', function (buf) {
      if (buf.toString() === 'true'){
        db.users.findAndModify({
          query: { "username": userNameFromToken }
	       // ,update: { $set: { tag: 'maintainer' } }
}, function (err, doc, lastErrorObject) {
          //TODO a return needed ?
})
      }
    });
  })
}
