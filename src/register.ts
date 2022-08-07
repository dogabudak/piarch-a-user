import {UserModel} from "../db/model/user";

export const registerUser = async (user) => {
        let {username, password} = user;
        if (username.length < 3 || password.length < 3) {
            return {message: 'username or password too short'}
        }
        // TODO you can fix this via unique token or something
        const reply = await UserModel.findOne({username})
            if (!reply) {
                const data = {sub: username, iss: 'piarch_a'};
                const options = {algorithm: 'RS256', expiresIn: (10 * 60 * 60)};
                await UserModel.insertMany([{username, password}])
                // TODO return a real token
                return 'TOKEN'
            } else {
                return {message: 'This user already exist'}
            }
}
