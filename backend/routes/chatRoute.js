import express from 'express';
import { getChatResponse } from '../controller/chatController.js';


const chatRouter = express.Router();


chatRouter.post('/chat', getChatResponse)



export default chatRouter;