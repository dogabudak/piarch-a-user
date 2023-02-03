import {ChatModel} from "../db/model/message";
import {UserModel} from "../db/model/user";

export const getChatsForUser = async (username) => {

    const users = await UserModel.findOne({username}, {chats: 1})
    if (users.chats.length) {
        const chatArray = []
        for (const chatId of users.chats) {
            chatArray.push(await getChatroom(chatId))
        }
        return chatArray
    }
    return null
}
export const getChatroom = async (chatRoomId) => {
    return ChatModel.findOne({chatId: chatRoomId}, {_id: -1})
}

