import { openRouterRequest } from "../config/openRouter.js";

export async function chat(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages) || !messages.every(m => m.role && m.content)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const response = await openRouterRequest(messages,'anthropic/claude-3-haiku');
    res.status(200).json(response);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.details 
    });
  }
}

export async function generateInsights (req, res) {
  try {
    const { messages } = req.body;
    const response = await openRouterRequest(
      messages,
      'meta-llama/llama-3.3-70b-instruct:free'
    );
    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
};

const handleError = (res, error) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: error.message || 'Internal server error',
    details: error.details 
  });
};
