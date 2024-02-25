import { model, Schema } from 'mongoose'
import {User, Gender, UserCoordinates} from 'piarch-a-interfaces'

const locationSchema = new Schema<UserCoordinates>({
    coords: {
        altitude: Number,
        altitudeAccuracy: Number,
        latitude: Number,
        accuracy: Number,
        longitude: Number,
        heading: Number,
        speed: Number,
    },
    timestamp: Date,
})
export const userSchema = new Schema<User>({
    // TODO instead of text index, you should use search index
    // TODO this index is not working
    username: { type: String, unique: true, text: true },
    password: { type: String, index: 1 },
    full_name: String,
    gender: String,
    birthdate: Date,
    mail: String,
    lastLogin: Date,
    phone: String,
    locations: [locationSchema],
    // TODO You should create a separate collection for user settings
    languagePreferences:[String],
    // TODO You should create a separate collection for user chats
    // TODO this should be array of references
    chats:[String],
})

export const UserModel = model<User>('User', userSchema)
