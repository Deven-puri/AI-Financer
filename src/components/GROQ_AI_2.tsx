import { Expense } from '../types';

export interface ExtractedBillData {
  name: string;
  amount: string;
  date: string;
  description: string;
  category: string;
  status?: 'PAID' | 'DUE';
}

/**
 * Extracts bill details from a bill photo using GROQ AI vision capabilities
 * @param imageBase64 - Base64 encoded image string (data URL format)
 * @returns Promise with extracted bill data
 */
export const extractBillDetails = async (
  imageBase64: string
): Promise<ExtractedBillData> => {
  let apiKey = process.env.REACT_APP_GROQ_API_KEY_2 || '';
  
  if (apiKey) {
    apiKey = apiKey.replace(/^["']+|["']+$/g, '').trim();
  }
  
  if (!apiKey || apiKey === '' || apiKey === 'your_groq_api_key_here' || apiKey.startsWith('your_')) {
    throw new Error('GROQ API key 2 not configured. Please set REACT_APP_GROQ_API_KEY_2 in your .env file.');
  }

  let base64Data = imageBase64.includes(',') 
    ? imageBase64.split(',')[1] 
    : imageBase64;

  let imageFormat = 'image/jpeg';
  if (imageBase64.includes('data:image/')) {
    const formatMatch = imageBase64.match(/data:image\/([^;]+)/);
    if (formatMatch) {
      imageFormat = `image/${formatMatch[1]}`;
    }
  }

  if (!base64Data || base64Data.length < 100) {
    throw new Error('Invalid image data. Please ensure the image is properly uploaded.');
  }

  const prompt = `You are an expert at extracting information from bill and receipt images. Analyze this bill/receipt image and extract the following information in JSON format:

1. **name**: The merchant/store name or main item/service name (e.g., "Walmart", "Electricity Bill", "Restaurant ABC")
2. **amount**: The total amount paid (as a number string, e.g., "1500.00" or "2500")
3. **date**: The date from the bill in YYYY-MM-DD format. If no date is found, use today's date: ${new Date().toISOString().split('T')[0]}
4. **description**: A brief description of what was purchased or the bill is for (e.g., "Groceries", "Monthly electricity bill", "Dinner at restaurant")
5. **category**: One of these categories: "Utility", "Rent", "Groceries", "Entertainment", or "Other" - choose the most appropriate one

IMPORTANT RULES:
- Extract ONLY information that is clearly visible in the image
- If any field cannot be determined, use reasonable defaults:
  - name: "Bill Payment" if merchant name not found
  - amount: "0.00" if amount not found (but try hard to find it)
  - date: Today's date if not found
  - description: "Bill payment" if unclear
  - category: "Other" if uncertain
- Return ONLY valid JSON, no additional text or markdown formatting
- The amount should be a string representation of the number (e.g., "1500.00")
- Ensure the date is in YYYY-MM-DD format

Return the response as a JSON object with this exact structure:
{
  "name": "string",
  "amount": "string",
  "date": "YYYY-MM-DD",
  "description": "string",
  "category": "Utility" | "Rent" | "Groceries" | "Entertainment" | "Other"
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at extracting structured data from bill and receipt images. Always return valid JSON only, no markdown, no explanations.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageFormat};base64,${base64Data}`
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: { message: response.statusText } };
      }
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your REACT_APP_GROQ_API_KEY_2 in the .env file.');
      }
      if (response.status === 400) {
        const errorMsg = errorData.error?.message || 'Invalid image format or API request';
        throw new Error(`Invalid request: ${errorMsg}. Please ensure the image is a valid photo of a bill or receipt (JPG, PNG format).`);
      }
      if (response.status === 404) {
        throw new Error('Vision model not found. The model may have been updated. Please check GROQ API documentation.');
      }
      throw new Error(`API error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI. Please try again.');
    }

    let extractedData: ExtractedBillData;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response: ${aiResponse}`);
    }

    const validatedData: ExtractedBillData = {
      name: extractedData.name || 'Bill Payment',
      amount: extractedData.amount || '0.00',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      description: extractedData.description || 'Bill payment',
      category: ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Other'].includes(extractedData.category)
        ? extractedData.category
        : 'Other',
      status: extractedData.status || 'PAID'
    };

    const amountNum = parseFloat(validatedData.amount);
    if (isNaN(amountNum) || amountNum < 0) {
      validatedData.amount = '0.00';
    } else {
      validatedData.amount = amountNum.toFixed(2);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(validatedData.date)) {
      validatedData.date = new Date().toISOString().split('T')[0];
    }

    return validatedData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to GROQ API. Please check your internet connection.');
    }
    throw error instanceof Error ? error : new Error('Failed to extract bill details. Please try again.');
  }
};
