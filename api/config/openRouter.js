import axios from 'axios';

export const openRouterRequest = async (messages) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        //model: 'openchat/openchat-7b',
        model:"deepseek/deepseek-r1-distill-llama-70b:free",
        //model:"meta-llama/llama-3.3-70b-instruct:free",
        //model: 'mistralai/mistral-7b-instruct:free',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // Replace with your URL
          'X-Title': 'Business Automation Chatbot',          // Replace with your app name
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


// import axios from 'axios';

// export const openRouterRequest = async (promptText) => {
//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: promptText
//               }
//             ]
//           }
//         ]
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
//   } catch (error) {
//     console.error('Gemini API Error:', error.response?.data || error.message);
//     throw new Error('Failed to get Gemini response');
//   }
// };
