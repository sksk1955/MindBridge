const chatData = {
    greeting: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      response: "Hello! I'm your medical assistant specializing in healthcare. I'm here to provide detailed information and support for your general health questions and concerns. How can I help you today?"
    },
    outside_scope: {
      keywords: ['diagnosis', 'prescription', 'treatment plan', 'medical advice', 'what should i do', 'what do i have'],
      response: "I can provide detailed information about health conditions, symptoms, and treatment options. For specific medical concerns, consulting a healthcare provider is recommended for personalized care. Would you like to know more about general information regarding your health concern?"
    },
    default: {
      keywords: [],
      response: "I'm here to provide detailed information about health conditions, treatments, and general medical knowledge. I can help you understand various conditions, treatments, and health management strategies. What specific information would you like to know about?"
    }
  }
  
export default chatData