import { ChromaClient, TransformersEmbeddingFunction } from "chromadb";


export async function fetchDocumentsLogic(input: string) {
    const client = new ChromaClient({
      path: "http://chroma-server:8000",
    });
  
    const query = input;
    const embedder = new TransformersEmbeddingFunction();
  
    const collection = await client.getOrCreateCollection({ name: "hypzert-dokumentation", embeddingFunction: embedder });
  
    const results = await collection.query({
      nResults: 2,
      queryTexts: [query]
    });
  
    return results;
  }