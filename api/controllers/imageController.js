import { openRouterImageRequest } from '../config/openRouter.js';
import axios from 'axios';

const analysisPrompts = {
  invoice: `Analyze this invoice image and return JSON containing: 
    { 
      "vendor_name": string, 
      "total_amount": number, 
      "date": "YYYY-MM-DD", 
      "items_purchased": [{ 
        "item_name": string, 
        "item_description": string, 
        "quantity": number, 
        "rate": number, 
        "amount": number 
      }] 
    }`,
  barcode: `Read this barcode/qr code and return JSON format: 
    { 
      "raw_data": string, 
      "type": "QR_CODE|BARCODE" 
    }`,
  quality: `Inspect this product image and return JSON with: 
    { 
      "defects": [{ 
        "description": string, 
        "confidence": number, 
        "severity": "low|medium|high" 
      }], 
      "quality_rating": 1-5 
    }`
};

const extractJSON = (textResponse) => {
  try {
    // Handle multi-line JSON and text wrapping
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const rawJson = jsonMatch[0]
      .replace(/(\\n|\\t|\\r)/g, '')  // Remove escape characters
      .replace(/(‘|’)/g, "'")         // Normalize quotes
      .replace(/\\/g, '');            // Remove backslashes

    return JSON.parse(rawJson);
  } catch (e) {
    console.error('JSON extraction failed:', e);
    return { error: `Failed to parse API response: ${e.message}` };
  }
};

export const imageAnalysis = (type) => async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const image = req.file.buffer.toString('base64');
    const prompt = analysisPrompts[type];

    const apiResponse = await openRouterImageRequest(image, prompt);
    
    const parsedData = typeof apiResponse === 'string' 
      ? extractJSON(apiResponse)
      : apiResponse;

    if (parsedData.error) {
      throw new Error(parsedData.error);
    }

    res.json({ 
      success: true, 
      data: parsedData 
    });

  } catch (error) {
    console.error(`${type} analysis error:`, error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message
    });
  }
};