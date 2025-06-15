import Chat from "../../models/mongodb/chat.model.js";
import RoomChat from "../../models/mongodb/rooms-chat.model.js";
import User from "../../models/mysql/user.js";
import { PubSub } from "graphql-subscriptions";

const CHAT_ADDED = "CHAT_ADDED";
const TYPING_STATUS = "TYPING_STATUS";
export const chatResolver = {
  Subscription: {
    typingStatus: {
      subscribe: (_, { roomChatId }, { pubsub }) => {
        return pubsub.asyncIterableIterator([`${TYPING_STATUS}.${roomChatId}`]);
      },
    },
    messageAdded: {
      subscribe: (_, { roomChatId }, { pubsub }) => {
        return pubsub.asyncIterableIterator([`${CHAT_ADDED}.${roomChatId}`]);
      },
    },
  },
  Query: {
    chats: async (_, { roomChatId }, context) => {
      try {
        if (!context.user) {
          throw new Error("Not authenticated, Cannot fetch room chat");
        }
        const chats = await Chat.find({
          roomChatId,
          deleted: false,
        }).populate("roomChatId");
        return chats;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    chat: async (_, { id }) => {
      const chat = await Chat.findById(id).populate("roomChatId");
      return chat;
    },
  },
  Chat: {
    user: async (parent, _, { userLoader }) => {
      try {
        return await userLoader.load(parent.userId);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    setTypingStatus: async (_, { roomChatId, isTyping }, { pubsub, user }) => {
      try {
        // console.log(user.user.user_id);
        const userTyping = await User.findOne({
          where: {
            user_id: user.user.user_id,
          },
        });
        await pubsub.publish(`${TYPING_STATUS}.${roomChatId}`, {
          typingStatus: {
            isTyping: isTyping,
            user: userTyping,
          },
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    sendChat: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error("Unauthorized");
        }
        const { roomChatId, content, images } = input;
        const user = await User.findOne({
          where: {
            user_id: context.user.user.user_id,
            is_active: 1,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        const roomChat = await RoomChat.findById(roomChatId);
        if (!roomChat) {
          throw new Error("Room chat not found");
        }
        if (!roomChat.users.includes(context.user.user.user_id)) {
          throw new Error("User is not a member of the room chat");
        }
        const chat = new Chat({
          userId: context.user.user.user_id,
          roomChatId,
          content,
          images,
        });
        await chat.save();

        await context.pubsub.publish(`${CHAT_ADDED}.${roomChatId}`, {
          messageAdded: chat,
        });

        return chat;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
