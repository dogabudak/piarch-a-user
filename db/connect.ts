import { connect } from 'mongoose'

const fiveSeconds = 1000 * 60 * 2
/**
 * A simple connection string with retry mechanism, for sake of the challenge, i did not think a more sophisticated approach is needed
 **/
export const connectWithRetry = () => {
    return new Promise<void>((resolve) => {
        connect(process.env.MONGODB, function (err) {
            if (err) {
                console.error(
                    'Failed to connect to mongo on startup - retrying in 5 sec',
                    err
                )
                setTimeout(connectWithRetry, fiveSeconds)
            } else {
                resolve()
            }
        })
    })
}
