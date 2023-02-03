import { model, Schema } from 'mongoose'
import {Chats} from 'piarch-a-interfaces'

const chatsSchema = new Schema<Chats>({
    chatId: String,
    messages: [{
        sender: String,
        recipient: String,
        message:String,
        timestamp:Date
    }]
})


export const ChatModel = model<Chats>('Chat', chatsSchema)
