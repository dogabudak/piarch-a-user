import * as nano from 'nanomsg'
const nanoReq = nano.socket('req');
// TODO find a way to keep mongo password as a secret
import * as config from '../config/config.json';

nanoReq.connect(config.verificationUrl);
// TODO write test for this
export const checkToken = async (token) => {
    return new Promise((resolve, reject)=>{
        nanoReq.send('jwt ' + token);
        nanoReq.on('data',  (buf) => {
            if (buf.toString() === 'true') {
                resolve(true)
            } else {
                reject({})
            }
        });
    })
}
