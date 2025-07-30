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

// Replace your handleSubmit function in Chat.tsx with this JavaScript version:

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!inputValue.trim() || isLoading) return

  const userMessage = inputValue.trim()
  setInputValue('')
  
  const newUserMessage = {
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  }
  
  console.log('Adding user message:', newUserMessage)
  setMessages(prev => {
    const updated = [...prev, newUserMessage]
    console.log('Updated messages after user:', updated)
    return updated
  })
  setIsLoading(true)

  try {
    // Debug the API URL
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('=== CHAT DEBUG ===');
    console.log('API URL from env:', apiUrl);
    console.log('Full request URL:', `${apiUrl}/api/chat`);
    console.log('Request payload:', {
      message: userMessage,
      sessionId: sessionId
    });

    const response = await axios.post(`${apiUrl}/api/chat`, {
      message: userMessage,
      sessionId: sessionId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('=== RESPONSE RECEIVED ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.data.success) {
      const newAssistantMessage = {
        role: 'assistant',
        content: response.data.data,
        timestamp: Date.now()
      }
      console.log('Adding assistant message:', newAssistantMessage)
      setMessages(prev => {
        const updated = [...prev, newAssistantMessage]
        console.log('Updated messages after assistant:', updated)
        return updated
      })
    }
  } catch (error) {
    console.error('=== CHAT ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    const errorMessage = {
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, errorMessage])
  } finally {
    setIsLoading(false)
  }
}