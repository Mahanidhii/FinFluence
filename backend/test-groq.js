/**
 * GROQ API Test Script
 * Run this to test GROQ API connection directly
 */

const Groq = require('groq-sdk');
require('dotenv').config();

async function testGroqAPI() {
  console.log('🧪 Testing GROQ API Connection...');
  console.log('🔑 API Key present:', !!process.env.GROQ_API_KEY);
  console.log('🔑 API Key length:', process.env.GROQ_API_KEY?.length || 0);
  
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is missing!');
    return;
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    console.log('📤 Sending test request to GROQ...');
    
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful financial assistant.' },
        { role: 'user', content: 'Hello! Please confirm you are working and say something about helping with finances.' }
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 100,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content;
    
    if (content) {
      console.log('✅ GROQ API Test SUCCESSFUL!');
      console.log('📝 Response:', content);
    } else {
      console.log('❌ GROQ API returned empty response');
    }

  } catch (error) {
    console.error('❌ GROQ API Test FAILED!');
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    // Try alternative models
    if (error.message?.includes('model')) {
      console.log('🔄 Trying alternative model: mixtral-8x7b-32768');
      
      try {
        const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY
        });

        const response2 = await groq.chat.completions.create({
          messages: [
            { role: 'user', content: 'Hello! Test message.' }
          ],
          model: 'mixtral-8x7b-32768',
          max_tokens: 50
        });

        console.log('✅ Alternative model works!');
        console.log('📝 Response:', response2.choices[0]?.message?.content);
      } catch (error2) {
        console.error('❌ Alternative model also failed:', error2.message);
      }
    }
  }
}

// Run the test
testGroqAPI().then(() => {
  console.log('🏁 Test completed');
}).catch((error) => {
  console.error('🚨 Test script error:', error);
});