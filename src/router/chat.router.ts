import express from 'express' 
import { sendMessage, getChatHistory,createChat } from '../controller/chat.controller.js'
const router = express.Router()

router.post('/chats', createChat);
router.get('/chats/:chatId/messages', getChatHistory);
router.post('/chats/:chatId/messages', sendMessage);

export default router