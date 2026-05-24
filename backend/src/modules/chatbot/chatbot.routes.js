import { Router } from 'express';
import { sendMessageToChatbot, chatbotSchema } from './chatbot.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware.js';

const router = Router();

// Public chatbot endpoint
router.post('/message', rateLimiter, validate(chatbotSchema), sendMessageToChatbot);

export default router;
