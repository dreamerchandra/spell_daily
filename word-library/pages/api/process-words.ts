import { NextApiRequest, NextApiResponse } from 'next';
import { WordData } from '../../types';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google'

const model = google('gemini-2.5-flash')

const getPrompt = (word: string) => {
  return `
Provide structured information about the word "${word}". Return ONLY a JSON object with this exact structure:
{
  "word": string,
  "ipa": string[],
  "syllable": string[],
  "actualSyllable": string[],
  "definition": string,
  "syllableOptions": string[][],
  "option": Record<'easy' | 'medium' | 'hard', string[]>,
  "usage": string[]
}
Here's an example
{
    word: 'CULTURE',
    ipa: ['ˈkʌl', 'tʃər'],
    syllable: ['cul', 'tur'],
    actualSyllable: ['cul', 'ture'],
    definition: 'The ideas, customs, and social behavior of a particular people or society',
    syllableOptions: [
      ['cul', 'kul', 'col'],
      ['ture', 'chur', 'tour'],
    ],
    option: {
      easy: ['culture', 'kulture'],
      medium: ['cultuer', 'cultre'],
      hard: ['culter', 'cultare'],
    },
    usage: [
      "The museum showcases the rich ___ of the indigenous people.",
      "Learning about different ___ helps us understand the world better.",
      "Pop ___ has influenced many aspects of modern society.",
    ],
}
Do not include any other text or any other format.
Do not respond in markdown format.
Just give the JSON object.
`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: "Method not allowed" });
    return
  }

  try {
    const { words } = req.body;

    if (!words || typeof words !== 'string') {
      res.status(400).send({ error: 'Invalid input. Please provide comma-separated words.' })
      return
    }

    // Split and clean the words
    const wordList = words
      .split(',')
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 0);

    if (wordList.length === 0) {
      res.status(400).send({ error: 'No valid words provided.' })
      return
    }

    const results: WordData[] = [];

    for (const word of wordList) {

      const { content } = await generateText({
        model,
        prompt: getPrompt(word)
      })

      // Parse the AI response
      if (content?.[0]?.type === 'text') {
        try {
          const parsed = JSON.parse(content[0].text);
          results.push(parsed);
        } catch (parseError) {
          console.log(parseError)
        }
      }
    }

    res.status(200).send({ data: results })
  } catch (error) {
    console.error('Error processing words:', error);
    res.status(500).send({ error: 'Failed to process words. Please try again.' })

  }
}
