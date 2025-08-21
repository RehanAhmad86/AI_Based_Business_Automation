import axios from 'axios';

export const openAIRequest = async (messages, model = 'gpt-4o-mini') => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('OpenAI Error:', error.response?.data || error.message);
    const err = new Error(error.response?.data?.error?.message || 'Failed to generate response');
    err.details = error.response?.data;
    throw err;
  }
};

export const openAIImageRequest = async (imageBase64, prompt, model = 'gpt-4o') => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { 
              type: 'image_url', 
              image_url: {
                url: `data:image/png;base64,${imageBase64}`
              }
            }
          ]
        }],
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Image Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Image processing failed');
  }
};