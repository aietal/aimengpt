import type { NextApiRequest, NextApiResponse } from "next";
import { ChromaClient, TransformersEmbeddingFunction } from "chromadb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new ChromaClient({
      path: "http://chroma-server:8000",
    });

    const query = "Hello World"; 

    const embedder = new TransformersEmbeddingFunction();

    const collection = await client.getOrCreateCollection({ name: "hypzert-dokumentation", embeddingFunction: embedder });

    // add documents to the collection
    await collection.add({
      ids: ["id1", "id2", "id3"],
      metadatas: [{"chapter": "3", "verse": "16"}, {"chapter": "3", "verse": "5"}, {"chapter": "29", "verse": "11"}], 
      documents: ["lorem ipsum...", "doc2", "doc3"], 
  })

  // query the collection
  const results = await collection.query({
      nResults: 2, 
      queryTexts: ["lorem ipsum"]
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