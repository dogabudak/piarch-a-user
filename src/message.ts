import {ChatModel} from "../db/model/message";
import {UserModel} from "../db/model/user";

export const getChatsForUser = async (username) => {

    const users = await UserModel.findOne({username}, {chats: 1})
    if (users?.chats!.length) {
        const chatArray: any[] = []
        for (const chatId of users.chats) {
            const chat = await getChatroom(chatId)
            chatArray.push(chat)
        }
        return chatArray
    }
    return null
}
export const getChatroom = async (chatRoomId) => {
    return ChatModel.findOne({chatId: chatRoomId}, {_id: -1})
}

