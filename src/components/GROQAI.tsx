import { Income, Expense } from '../types';

export const askGROQ = async (
  question: string,
  incomes: Income[],
  expenses: Expense[]
): Promise<string> => {
  let apiKey = process.env.REACT_APP_GROQ_API_KEY || '';
  
  if (process.env.NODE_ENV === 'development') {
    console.log('GROQ API Key check:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      startsWith: apiKey?.substring(0, 10) || 'none'
    });
  }
  
  if (apiKey) {
    apiKey = apiKey.replace(/^["']+|["']+$/g, '').trim();
  }
  
  if (!apiKey || apiKey === '' || apiKey === 'your_groq_api_key_here' || apiKey.startsWith('your_')) {
    return `Error: GROQ API key not configured.\n\nYour .env file should have:\nREACT_APP_GROQ_API_KEY=gsk_your_key_here\n\n(No quotes around the key!)\n\nThen restart your server: npm start`;
  }

  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount || '0'), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
  const balance = totalIncome - totalExpense;

  const incomeByMonth = groupByMonth(incomes);
  const expenseByMonth = groupByMonth(expenses);

  const prompt = `You are a friendly and professional financial advisor AI assistant. Analyze this financial data and provide helpful, easy-to-understand advice.

Financial Summary:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpense.toFixed(2)}
- Balance: ₹${balance.toFixed(2)}
- Income Records: ${incomes.length}
- Expense Records: ${expenses.length}

Income Trends by Month: ${JSON.stringify(incomeByMonth)}
Expense Trends by Month: ${JSON.stringify(expenseByMonth)}

User Question: ${question}

IMPORTANT: Write your response in a friendly, conversational tone that's easy to read and understand. Use:
- Short paragraphs (2-3 sentences max)
- Bullet points for lists
- Clear headings when needed
- Emojis sparingly (only when helpful: 💰 📊 📈 💡)
- Simple language (avoid jargon)
- Positive, encouraging tone
- Specific numbers and examples from their data

Format your response to be visually appealing and scannable. Make it feel like you're having a helpful conversation, not reading a financial report.

Answer:`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly, professional financial advisor AI. Write responses in a conversational, easy-to-read style. Use short paragraphs, bullet points, and clear formatting. Be encouraging and helpful, not judgmental. Always reference specific numbers from the user\'s data when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        return 'Error: Invalid API key. Please check your REACT_APP_GROQ_API_KEY in the .env file.';
      }
      throw new Error(`API error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return 'No response from AI. Please try again.';
    }
    
    return aiResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return 'Error: Unable to connect to GROQ API. Please check your internet connection.';
    }
    return `Error: ${error instanceof Error ? error.message : 'Failed to connect to GROQ AI. Please try again.'}`;
  }
};

const groupByMonth = (items: Income[] | Expense[]): Record<string, number> => {
  const grouped: Record<string, number> = {};
  
  items.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const amount = parseFloat(item.amount || '0');
    
    grouped[monthKey] = (grouped[monthKey] || 0) + amount;
  });
  
  return grouped;
};

