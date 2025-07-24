const chatData = {
    greeting: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      response: "Hello! I'm your mental health assistant. I'm here to provide supportive guidance and information about mental wellness. How are you feeling today?"
    },
    outside_scope: {
      keywords: ['diagnosis', 'suicide', 'self-harm', 'emergency', 'crisis'],
      response: "I hear that you're going through a difficult time. For immediate support, please contact a mental health crisis hotline or emergency services. Would you like information about crisis resources and helplines?"
    },
    default: {
      keywords: [],
      response: "I'm here to provide supportive information about mental wellness, stress management, and emotional wellbeing. What would you like to know more about?"
    }
  }
  
export default chatData;