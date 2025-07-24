import fs from 'fs';
import path from 'path';

// Simple document storage
export const documentStore = new Map();
export const vectorStore = null; // We'll use simple search instead

// Function to load documents
export async function loadDocuments() {
  try {
    const docsPath = path.join(process.cwd(), 'data', 'medical_knowledge');
    
    // Check if directory exists
    if (!fs.existsSync(docsPath)) {
      console.log(`Directory ${docsPath} does not exist. Creating it...`);
      fs.mkdirSync(docsPath, { recursive: true });
      
      // Create a sample mental health document
      const sampleContent = `
Mental Health Support and Wellness Information:

## Anxiety Management Techniques:
- Deep breathing exercises: Inhale for 4 counts, hold for 4, exhale for 6
- Progressive muscle relaxation: Tense and release muscle groups
- Mindfulness meditation: Focus on present moment awareness
- Regular physical exercise: 30 minutes daily can reduce anxiety
- Limit caffeine and alcohol consumption
- Maintain consistent sleep schedule

## Depression Support Strategies:
- Stay connected with friends and family
- Establish and maintain daily routines
- Set small, achievable daily goals
- Practice self-compassion and positive self-talk
- Engage in activities you previously enjoyed
- Consider professional counseling or therapy
- Maintain proper nutrition and hydration

## Stress Management:
- Time management and prioritization techniques
- Regular breaks during work or study
- Healthy sleep habits (7-9 hours nightly)
- Balanced nutrition with regular meals
- Social support and communication
- Relaxation techniques like yoga or tai chi

## When to Seek Professional Help:
- Persistent feelings of sadness or hopelessness
- Loss of interest in activities
- Significant changes in appetite or sleep
- Difficulty concentrating or making decisions
- Thoughts of self-harm or suicide
- Substance abuse as coping mechanism

## Crisis Resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- SAMHSA National Helpline: 1-800-662-4357
- Emergency services: 911

## Self-Care Practices:
- Regular exercise and physical activity
- Adequate sleep and rest
- Healthy eating habits
- Mindfulness and meditation
- Creative activities and hobbies
- Social connections and support
- Professional therapy when needed

Remember: Mental health is just as important as physical health. Seeking help is a sign of strength, not weakness.
      `;
      
      fs.writeFileSync(path.join(docsPath, 'mental_health_guide.txt'), sampleContent.trim());
      console.log('Created sample mental health document');
    }
    
    const files = fs.readdirSync(docsPath);
    
    if (files.length === 0) {
      console.log('No files found in medical_knowledge directory');
      return;
    }
    
    console.log(`Loading ${files.length} documents...`);
    
    for (const file of files) {
      const filePath = path.join(docsPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      documentStore.set(file, content);
    }
    
    console.log('Documents loaded successfully into document store');
  } catch (error) {
    console.error('Error loading documents:', error);
  }
}

// Simple search function
export function simpleSearch(query, limit = 3) {
  const results = [];
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(' ').filter(word => word.length > 2);
  
  for (const [filename, content] of documentStore.entries()) {
    const contentLower = content.toLowerCase();
    let score = 0;
    
    // Score based on query word matches
    queryWords.forEach(word => {
      const matches = (contentLower.match(new RegExp(word, 'gi')) || []).length;
      score += matches;
    });
    
    // Also check for exact phrase match
    if (contentLower.includes(queryLower)) {
      score += 5;
    }
    
    if (score > 0) {
      // Extract relevant excerpt
      const sentences = content.split(/[.!?]+/);
      let relevantExcerpt = '';
      
      for (const sentence of sentences) {
        if (queryWords.some(word => sentence.toLowerCase().includes(word))) {
          relevantExcerpt += sentence.trim() + '. ';
          if (relevantExcerpt.length > 300) break;
        }
      }
      
      results.push({
        content: relevantExcerpt || content.substring(0, 300) + '...',
        source: filename,
        score
      });
    }
  }
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}