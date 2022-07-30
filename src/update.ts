export const updateUser = (collection, username, userObject) => {
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
export const updatePassword = (collection, username, password) => {
    return new Promise((fulfill, reject) => {
        collection.update(
            {"username": username},
            { $set: { password } },
            (err, updatedDoc) => {
                if (err){
                    reject()
                } else {
                    fulfill({})
                }
            })
    })
}
export const updateCurrentLocation = (collection, username, location) => {
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
