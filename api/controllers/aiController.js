// import { openRouterRequest } from "../config/openRouter.js";

// export async function chat(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { messages } = req.body;
    
//     if (!Array.isArray(messages) || !messages.every(m => m.role && m.content)) {
//       return res.status(400).json({ error: 'Invalid messages format' });
//     }

//     const response = await openRouterRequest(messages,'anthropic/claude-3-haiku');
//     res.status(200).json(response);
//   } catch (error) {
//     console.error('API Error:', error);
//     res.status(500).json({ 
//       error: error.message || 'Internal server error',
//       details: error.details 
//     });
//   }
// }

// export async function generateInsights (req, res) {
//   try {
//     const { messages } = req.body;
//     const response = await openRouterRequest(
//       messages,
//       'meta-llama/llama-3.3-70b-instruct:free'
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// const handleError = (res, error) => {
//   console.error('API Error:', error);
//   res.status(500).json({ 
//     error: error.message || 'Internal server error',
//     details: error.details 
//   });
// };



import { openAIRequest, openAIImageRequest } from "../config/openai.js";

export async function chat(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Check if any message has an image
    const hasImage = messages.some(msg => msg.content && Array.isArray(msg.content));
    
    // Use GPT-4o for images (supports vision), GPT-4o-mini for text only
    const model = hasImage ? 'gpt-4o' : 'gpt-4o-mini';
    const response = await openAIRequest(messages, model);
    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
}

export async function processImage(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, prompt } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use OpenAI GPT-4o for image analysis (supports vision)
    const response = await openAIImageRequest(imageBase64, prompt, 'gpt-4o');
    res.status(200).json({ content: response });
  } catch (error) {
    handleError(res, error);
  }
}

export async function generateInsights(req, res) {
  try {
    const { messages } = req.body;
    
    // Use OpenAI GPT-4o for insights (more capable)
    const response = await openAIRequest(messages, 'gpt-4o');
    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
}

const handleError = (res, error) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: error.message || 'Internal server error',
    details: error.details 
  });
};
