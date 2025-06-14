// import { openRouterImageRequest } from '../config/openRouter.js';
// import axios from 'axios';

// const analysisPrompts = {
//   invoice: "Analyze this invoice image and extract: vendor name, total amount, date, items purchased in JSON format",
//   // barcode: "Read this barcode/qr code and return the raw data and type",
//  barcode:`Read this barcode/qr code and return JSON format: { "raw_data": string, "type": "QR_CODE|BARCODE" }`,
//   quality: "Inspect this product image for defects and quality issues. List findings with confidence scores"
// };

// export const imageAnalysis = (type) => async (req, res) => {
//   try {
//     console.log('Uploaded File:', req.file);
//     if (!req.file) {
//       return res.status(400).json({ success: false, error: 'No file uploaded' });
//     }
//     const image = req.file.buffer.toString('base64');
//     const prompt = analysisPrompts[type];
//     console.log('Uploaded File:', req.file);
    
//     // For OpenRouter implementation
//     const result = await openRouterImageRequest(image, prompt);
    
//     // Alternative direct API implementation example
//     // const result = await axios.post('https://api.openrouter.ai/v1/vision', {
//     //   image,
//     //   prompt,
//     //   model: 'google/palm-vision'
//     // });

//     res.json({ success: true, data: result });
//   } catch (error) {
//     console.error(`${type} analysis error:`, error);
//     res.status(500).json({
//       success: false,
//       error: error.response?.data?.error || error.message
//     });
//   }
// };
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

    // Get raw API response
    const apiResponse = await openRouterImageRequest(image, prompt);
    
    // Process response
    const parsedData = typeof apiResponse === 'string' 
      ? extractJSON(apiResponse)
      : apiResponse;

    // Handle nested errors
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