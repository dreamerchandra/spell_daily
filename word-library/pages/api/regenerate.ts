import { NextApiRequest, NextApiResponse } from 'next';
import { generateText } from 'ai';
import { getConversationHistory, addMessage } from '../../lib/conversation-store';
import { getSystemPrompt } from './llm/prompt';
import { MODEL } from './llm/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  try {
    const { word, field } = req.body;

    if (!word || !field) {
      res.status(400).send({ error: 'Missing word or field' });
      return;
    }

    // Get conversation history from backend store
    const conversationHistory = getConversationHistory(word);

    // Build messages array from conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: getSystemPrompt(word),
      },
    ];

    // Add all messages from conversation history
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add the current regeneration request
    const requestContent = `Regenerate the value for the field "${field}". Return ONLY a JSON object with the key "${field}" and its new value. Make sure to provide a different value than previous attempts.`;

    messages.push({
      role: 'user',
      content: requestContent,
    });

    const { content } = await generateText({
      model: MODEL,
      messages,
    });

    if (content?.[0]?.type === 'text') {
      try {
        // Clean up potential markdown code blocks if the model adds them despite instructions
        const cleanText = content[0].text.replace(/```json\n?|\n?```/g, '');
        const parsed = JSON.parse(cleanText);

        if (parsed[field] !== undefined) {
          // Store the request and response in conversation history
          addMessage(word, {
            role: 'user',
            content: requestContent,
            field,
            timestamp: Date.now(),
          });

          addMessage(word, {
            role: 'assistant',
            content: JSON.stringify({ [field]: parsed[field] }),
            field,
            timestamp: Date.now(),
          });

          res.status(200).send({ data: parsed[field] });
          return;
        }

        res.status(500).send({ error: 'Field not found in response' });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.status(500).send({ error: 'Failed to parse AI response' });
      }
    } else {
      res.status(500).send({ error: 'No text content in response' });
    }

  } catch (error) {
    console.error('Error regenerating field:', error);
    res.status(500).send({ error: 'Failed to regenerate field' });
  }
}
