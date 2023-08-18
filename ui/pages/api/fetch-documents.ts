import type { NextApiRequest, NextApiResponse } from "next";
import { ChromaClient, TransformersEmbeddingFunction } from "chromadb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const client = new ChromaClient({
      path: "http://localhost:8000"
    });

  const query = req.body.query

  const embedder = new TransformersEmbeddingFunction();

  const collection = await client.getCollection({name: "hypzert-dokumentation", embeddingFunction: embedder})

  const results = await collection.query({
    nResults: 2, 
    queryTexts: ["Hi"],
  }) 

  res.status(200).json(results);
}
