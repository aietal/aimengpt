import type { NextApiRequest, NextApiResponse } from "next";
import { ChromaClient} from "chromadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ChromaClient({
      path: "http://chroma-server:8000",
    });

    await client.deleteCollection({name: "hypzert-dokumentation"})

    res.status(200).json("Deleted collection.");
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
    res.status(500).json({ error: 'An unexpected error occurred :(' });
  }
}