import { GoogleGenerativeAI } from '@google/generative-ai';
import { vectorStore, simpleSearch, documentStore } from '../utils/vectorStore.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Store conversation history
const conversationHistory = new Map();

const PROMPT_TEMPLATE = `
You are MediHelp, a mental health assistant chatbot specialized in providing supportive guidance and information about mental wellness.

IMPORTANT GUIDELINES:
- You are NOT a replacement for professional medical care
- For crisis situations, always direct users to emergency services or crisis hotlines
- Provide supportive, empathetic responses focused on mental wellness
- If asked about serious medical conditions, recommend consulting healthcare professionals
- Focus on general wellness, stress management, and emotional support

Retrieved relevant information:
{context}

Previous conversation:
{history}

User question: {question}

Please provide a helpful, supportive response:
`;

// Function to get conversation context
const getConversationContext = (sessionId) => {
  return conversationHistory.get(sessionId) || [];
};

// Function to update conversation context
const updateConversationContext = (sessionId, message, response) => {
  const history = getConversationContext(sessionId);
  history.push({ role: 'user', content: message });
  history.push({ role: 'assistant', content: response });
  conversationHistory.set(sessionId, history);
  
  // Limit history to last 10 messages
  if (history.length > 10) {
    conversationHistory.set(sessionId, history.slice(-10));
  }
};

// Function to get relevant context from documents
const getRelevantContext = async (message) => {
  try {
    // Try vector store first
    if (vectorStore && vectorStore.similaritySearch) {
      const relevantDocs = await vectorStore.similaritySearch(message, 3);
      return relevantDocs.map(doc => doc.pageContent).join('\n\n');
    }
  } catch (error) {
    console.log('Vector store search failed, using simple search:', error.message);
  }
  
  // Fallback to simple search
  const results = simpleSearch(message, 3);
  return results.map(result => result.content).join('\n\n');
};

// Check for crisis keywords
const checkForCrisisKeywords = (message) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'hurt myself', 'self harm', 
    'want to die', 'better off dead', 'emergency', 'crisis'
  ];
  
  const messageLower = message.toLowerCase();
  return crisisKeywords.some(keyword => messageLower.includes(keyword));
};

// Crisis response
const getCrisisResponse = () => {
  return `I'm very concerned about what you're going through right now. Please reach out for immediate help:

🚨 **CRISIS RESOURCES:**
• **National Suicide Prevention Lifeline:** 988 or 1-800-273-8255
• **Crisis Text Line:** Text HOME to 741741
• **Emergency Services:** 911
• **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

You matter, and there are people who want to help you through this difficult time. Please don't hesitate to reach out to these resources or go to your nearest emergency room.

Is there someone you trust who you can talk to right now?`;
};

// Chat response controller
export const getChatResponse = async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Check for crisis situations first
    if (checkForCrisisKeywords(message)) {
      const crisisResponse = getCrisisResponse();
      updateConversationContext(sessionId, message, crisisResponse);
      
      return res.json({
        success: true,
        data: crisisResponse
      });
    }

    // Get conversation history
    const history = getConversationContext(sessionId);
    const historyText = history.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');

    // Get relevant context from documents
    const context = await getRelevantContext(message);

    // Create the full prompt
    const fullPrompt = PROMPT_TEMPLATE
      .replace('{context}', context || 'No specific relevant information found.')
      .replace('{history}', historyText || 'No previous conversation.')
      .replace('{question}', message);

    // Generate response using Gemini
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();

    // Update conversation history
    updateConversationContext(sessionId, message, responseText);

    return res.json({
      success: true,
      data: responseText
    });

  } catch (error) {
    console.error('Error in getChatResponse:', error);
    
    // Provide a fallback response
    const fallbackResponse = "I apologize, but I'm having trouble processing your request right now. For immediate mental health support, please consider contacting a mental health professional or crisis helpline. Is there anything specific about mental wellness I can help you with?";
    
    return res.status(500).json({
      success: false,
      message: 'Error processing request',
      data: fallbackResponse,
      error: error.message
    });
  }
};