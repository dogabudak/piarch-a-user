export const getUser = (collection, username) => {
    return new Promise(async (fulfill) => {
        const user = await collection.findOne({"username": username});
        // TODO use projection instead
        delete user.locations
        fulfill(user)
    })
}

export const getUserNameFromToken = (token) => {
    const tokenArr = token.split('.');
    const tokenClaims = Buffer.from(tokenArr[1], 'base64');
    return (JSON.parse(tokenClaims.toString())).sub;
}
