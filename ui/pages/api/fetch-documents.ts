import type { NextApiRequest, NextApiResponse } from "next";
import { ChromaClient, TransformersEmbeddingFunction } from "chromadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ChromaClient({
      path: "http://chroma-server:8000",
    });

    const query = req.body.input;

    const embedder = new TransformersEmbeddingFunction();

    const collection = await client.getOrCreateCollection({ name: "hypzert-dokumentation", embeddingFunction: embedder });

  // query the collection
  const results = await collection.query({
      nResults: 1, 
      queryTexts: [query]
  }) 

    res.status(200).json(results);
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