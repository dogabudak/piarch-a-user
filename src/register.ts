export const registerUser = (collection,user) => {
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
