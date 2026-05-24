import { processChat } from './chatbot.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { z } from 'zod';

export const chatbotSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, 'Content cannot be empty')
  })).min(1, 'At least one message is required')
});

export const sendMessageToChatbot = async (req, res) => {
  try {
    const reply = await processChat(req.body.messages);
    return successResponse(res, 200, 'Chatbot message processed', { reply });
  } catch (error) {
    return errorResponse(res, error);
  }
};
