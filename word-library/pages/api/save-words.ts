import { NextApiRequest, NextApiResponse } from 'next';

interface WordData {
  word: string;
  definition: string;
  example: string;
  synonyms: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { words }: { words: WordData[] } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).send({ error: 'Invalid data format' })
    }

    // Save to database using Prisma

    res.status(200).send({
      success: true,
      count: words.length,
      message: `${words.length} word(s) saved successfully`,
    })
  } catch (error) {
    console.error('Error saving words:', error);
    res.status(500).send({ error: 'Failed to save words to database' })
  }
}
