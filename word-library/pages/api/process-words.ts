import { NextApiRequest, NextApiResponse } from 'next';
import { WordData } from '../../types';
import { generateText } from 'ai';
import { initializeConversation } from '../../lib/conversation-store';
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
    const { words } = req.body;

    if (!words || typeof words !== 'string') {
      res.status(400).send({
        error: 'Invalid input. Please provide comma-separated words.',
      });
      return;
    }

    // Split and clean the words
    const wordList = words
      .split(',')
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 0);

    if (wordList.length === 0) {
      res.status(400).send({ error: 'No valid words provided.' });
      return;
    }

    const results: WordData[] = [];

    for (const word of wordList) {
      const { content } = await generateText({
        model: MODEL,
        prompt: getSystemPrompt(word),
      });

      // Parse the AI response
      if (content?.[0]?.type === 'text') {
        try {
          const parsed = JSON.parse(content[0].text);
          results.push(parsed);

          // Initialize conversation history for this word
          initializeConversation(parsed.word, parsed);
        } catch (parseError) {
          console.log(parseError);
        }
      }
    }

    res.status(200).send({ data: results });
  } catch (error) {
    console.error('Error processing words:', error);
    res
      .status(500)
      .send({ error: 'Failed to process words. Please try again.' });
  }
}
