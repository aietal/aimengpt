/* eslint-disable import/no-anonymous-default-export */
import { ChromaClient, TransformersEmbeddingFunction } from 'chromadb';

async function fetchDocuments(input:string) {
  const client = new ChromaClient({ path: "http://chroma-server:8000" });
  const embedder = new TransformersEmbeddingFunction();
  const collection = await client.getOrCreateCollection({ name: "hypzert-dokumentation", embeddingFunction: embedder });
  const results = await collection.query({ nResults: 2, queryTexts: [input] });
  return results;
}

export default async (req:any, res:any) => {
  try {
    const input = req.body.input;
    const results = await fetchDocuments(input);
    res.status(200).json(results);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};