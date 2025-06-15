import { authTypeDef } from "../services/auth_service/auth.typeDef.js";
import { userTypeDef } from "../services/user_service/user.typeDef.js";
import { friendTypeDef } from "../services/friend_service/friend.typeDef.js";
import { postTypeDef } from "../services/post_service/post.typeDef.js";
import { roomChatTypeDef } from "../services/room_chat_service/room_chat.typeDef.js";
import { chatTypeDef } from "../services/chat_service/chat.typeDef.js";
import { likeTypeDef } from "../services/like_service/like.typeDef.js";
import { notificationTypeDef } from "../services/notification_service/notification.typeDef.js";
import { commentTypeDef } from "../services/comment_service/comment.typeDef.js";
import { searchTypeDef } from "../services/search_service/search.typeDef.js";
export const typeDefs = [
  authTypeDef,
  userTypeDef,
  friendTypeDef,
  chatTypeDef,
  roomChatTypeDef,
  postTypeDef,
  likeTypeDef,
  notificationTypeDef,
  commentTypeDef,
  searchTypeDef,
];
