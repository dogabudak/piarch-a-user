import * as mongodb from 'mongodb'

const fiveSeconds = 1000 * 60 * 2
/**
 * A simple connection string with retry mechanism, for sake of the challenge, i did not think a more sophisticated approach is needed
 **/
export const connectWithRetry = async () => {
    const MongoClient = mongodb.MongoClient;
    const client = new MongoClient(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true});
    try {
        const connection = await client.connect()
        const db = connection.db('piarka');
        return db.collection('users');
    } catch (e) {
        console.error(
            'Failed to connect to mongo on startup - retrying in 5 sec',
            e
        )
        setTimeout(connectWithRetry, fiveSeconds)
    }
}
