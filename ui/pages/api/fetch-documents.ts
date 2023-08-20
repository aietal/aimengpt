import type { NextApiRequest, NextApiResponse } from "next";
import { ChromaClient, TransformersEmbeddingFunction } from "chromadb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ChromaClient({
      path: "http://localhost:8000",
    });

    const query = req.body.query;
    const embedder = new TransformersEmbeddingFunction();

    const collection = await client.getCollection({ name: "hypzert-dokumentation", embeddingFunction: embedder });

    const results = await collection.query({
      nResults: 2,
      queryTexts: [query],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}