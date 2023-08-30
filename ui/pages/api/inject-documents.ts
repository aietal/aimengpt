import type { NextApiRequest, NextApiResponse } from 'next';

import { ChromaClient, TransformersEmbeddingFunction } from 'chromadb';
import { IncomingForm } from 'formidable';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to upload file' });
      }

      const client = new ChromaClient({
        path: process.env.CHROMA_PATH || 'http://chroma-server:8000',
      });

      const loader = new PDFLoader(files.pdf[0].filepath);

      const originalDocs = await loader.load();

      console.log(JSON.stringify(originalDocs));


      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
      });      

      const docs = await splitter.splitDocuments(originalDocs);
 
      // Process the documents and perform other logic
      const { ids, metadatas, documentContents } = processDocuments(docs);

      const embedder = new TransformersEmbeddingFunction();
      const collection = await client.getOrCreateCollection({
        name: 'default-collection',
        embeddingFunction: embedder,
      });

      await collection.add({
        ids,
        metadatas,
        documents: documentContents,
      });

      res.status(200).json({
        message: 'Documents processed successfully',
        documentCount: ids.length,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while processing the documents' });
  }
}

function processDocuments(docs: any) {
  const ids = [];
  const metadatas = [];
  const documentContents = [];

  for (const document of docs) {
    // Generate an ID for each document, or use some existing unique identifier
    const id = uuidv4();
    ids.push(id);

    const fallbackTitle = path.basename(document.metadata.source);
    const titleFromMetadata = document.metadata.pdf.info.Title;

    const title = titleFromMetadata && titleFromMetadata.length > 0 ? titleFromMetadata : fallbackTitle;

  
    const metadata = {
      title: title,
      page: document.metadata.loc.pageNumber, // Define this function to extract chapter info
      source: document.metadata.source, // Define this function to extract verse info
    };
    metadatas.push(metadata);

    // Add the page content to the documents array
    documentContents.push(document.pageContent);
  }

  return { ids, metadatas, documentContents };
}
