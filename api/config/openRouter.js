import axios from 'axios';

export const openRouterRequest = async (messages, model = 'deepseek/deepseek-r1-0528-qwen3-8b:free') => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Business Automation Chatbot',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    const err = new Error(error.response?.data?.error?.message || 'Failed to generate response');
    err.details = error.response?.data;
    throw err;
  }
};

export const openRouterImageRequest = async (imageBase64, prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "google/gemini-pro-vision", 
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: `data:image/png;base64,${imageBase64}` }
          ]
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Image Processor'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Image processing failed');
  }
};