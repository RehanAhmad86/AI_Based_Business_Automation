import asyncHandler from 'express-async-handler';
import { openRouterRequest } from '../config/openRouter.js';

const generateEmail = asyncHandler(async (req, res) => {
  const { prompt, tone } = req.body;
  
  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt');
  }

  try {
    const systemMessage = `You are a professional email assistant. Generate email content based on:
    - User prompt: ${prompt}
    - Tone: ${tone || 'neutral'}
    - Format: Proper email structure with subject, greeting, body, and closing
    - Use line breaks for proper formatting
    - Length: 150-300 words
    - Response must be in plain text format without markdown`;

    const messages = [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await openRouterRequest(messages, 'deepseek/deepseek-r1-0528-qwen3-8b:free');
    // const response = await openRouterRequest(messages, 'deepseek/deepseek-r1-0528-qwen3-8b:free');
    
    const content = response.choices[0].message.content;
    
    res.status(200).json({
      success: true,
      content: content.replace(/\n/g, '\n') // Ensure proper line breaks
    });
    
  } catch (error) {
    console.error('Email Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate email'
    });
  }
});

export { generateEmail };