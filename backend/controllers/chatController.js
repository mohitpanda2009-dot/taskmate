const { Op } = require('sequelize');
const { Chat, Message, User, Task } = require('../models');
const ApiError = require('../utils/ApiError');
const { success, paginated } = require('../utils/apiResponse');
const { parsePagination } = require('../utils/helpers');

/**
 * GET /api/chats
 * List user's chats
 */
async function listChats(req, res, next) {
  try {
    const userId = req.userId;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ creator_id: userId }, { doer_id: userId }],
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'avatar_url', 'is_online'],
        },
        {
          model: User,
          as: 'doer',
          attributes: ['id', 'name', 'avatar_url', 'is_online'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'status', 'budget'],
        },
      ],
      order: [['last_message_at', 'DESC NULLS LAST']],
    });

    // Add unread count for each chat
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.count({
          where: {
            chat_id: chat.id,
            sender_id: { [Op.ne]: userId },
            read: false,
          },
        });

        const chatJson = chat.toJSON();
        chatJson.unread_count = unreadCount;

        // Add "other_user" field for convenience
        chatJson.other_user =
          chatJson.creator_id === userId ? chatJson.doer : chatJson.creator;

        return chatJson;
      })
    );

    return success(res, { chats: chatsWithUnread });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/chats/:id/messages
 * Get messages for a chat (paginated)
 */
async function getMessages(req, res, next) {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    const chat = await Chat.findByPk(chatId);
    if (!chat) throw ApiError.notFound('Chat not found');

    // Verify user is a participant
    if (chat.creator_id !== userId && chat.doer_id !== userId) {
      throw ApiError.forbidden('Not a participant of this chat');
    }

    const { page, limit, offset } = parsePagination(req.query);

    const { rows, count } = await Message.findAndCountAll({
      where: { chat_id: chatId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar_url'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    // Mark unread messages from the other user as read
    await Message.update(
      { read: true },
      {
        where: {
          chat_id: chatId,
          sender_id: { [Op.ne]: userId },
          read: false,
        },
      }
    );

    return paginated(res, { rows: rows.reverse(), count, page, limit });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/chats/:id/messages
 * Send a message
 */
async function sendMessage(req, res, next) {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    const chat = await Chat.findByPk(chatId);
    if (!chat) throw ApiError.notFound('Chat not found');

    // Verify user is a participant
    if (chat.creator_id !== userId && chat.doer_id !== userId) {
      throw ApiError.forbidden('Not a participant of this chat');
    }

    const { text, media_url, media_type } = req.body;

    if (!text && !media_url) {
      throw ApiError.badRequest('Message must have text or media');
    }

    const message = await Message.create({
      chat_id: chatId,
      sender_id: userId,
      text: text || null,
      media_url: media_url || null,
      media_type: media_type || null,
    });

    // Update chat's last message
    await chat.update({
      last_message_at: new Date(),
      last_message_text: text ? text.substring(0, 500) : `[${media_type || 'media'}]`,
    });

    // Reload with sender info
    await message.reload({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar_url'],
        },
      ],
    });

    // Emit via socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`chat:${chatId}`).emit('message:new', {
        message: message.toJSON(),
      });

      // Notify the other user
      const recipientId =
        chat.creator_id === userId ? chat.doer_id : chat.creator_id;

      io.to(`user:${recipientId}`).emit('chat:newMessage', {
        chatId,
        message: message.toJSON(),
      });
    }

    return success(res, { message }, 'Message sent');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listChats,
  getMessages,
  sendMessage,
};
