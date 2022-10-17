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
    username: { type: String, unique: true, index: true },
    password: { type: String, unique: true, index: true },
    full_name: String,
    gender: String,
    mail: String,
    birthdate: Date,
    lastLogin: Date,
    phone: String,
    locations: [locationSchema],
    languagePreferences:[String]
})

export const UserModel = model<User>('User', userSchema)
