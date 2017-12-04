const route = require('koa-route'),
    koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    config = require('./resources/config.js'),
    mongojs = require('mongojs'),
    db = mongojs(config.mongo.url, ['users']),
    nano = require('nanomsg'),
    nanoReq = nano.socket('req');


var app = new koa();
app.listen(config.server.port);

app.use(bodyParser());
app.use(route.get('/update', async ctx => {
  this.body = await updateUserFunction(ctx.header);
}));


//app.use(route.post('/update', currentLoc));
nanoReq.connect(config.verificationUrl);



//function * currentLoc() {
//    this.body = yield currentLocFunction(this);
//}

function currentLocFunction(context) {
  //TODO location inform. is at content, need to write mongo
  console.log(context.request.body)
    return new Promise(function (fulfill, reject) {

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
              db.users.find({"username":userNameFromToken}).forEach(function (err, doc) {
                if(doc !== null || doc !=="null"){
                  //TODO handle error
                }
                  //TODO update the user with incoming parameters

                })
          }
        });
    })
}
