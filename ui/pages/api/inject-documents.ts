import type { NextApiRequest, NextApiResponse } from 'next';

import { ChromaClient, TransformersEmbeddingFunction } from 'chromadb';
import { IncomingForm } from 'formidable';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
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
        path: process.env.CHROMA_PATH || 'http://localhost:8000',
      });

      const loader = new PDFLoader(files.pdf[0].filepath);
      // const docs = await loader.load();

      const originalDocs = await loader.load();
      const docs = [];

      for (const originalDoc of originalDocs) {
        const contentLength = originalDoc.pageContent.length;
        const thirdLength = Math.floor(contentLength / 3);

        for (let i = 0; i < 3; i++) {
          const start = i * thirdLength;
          const end = i < 2 ? (i + 1) * thirdLength : contentLength; // Making sure to include the remaining part

          const newDoc = {
            pageContent: originalDoc.pageContent.substring(start, end),
            metadata: { ...originalDoc.metadata },
          };
          docs.push(newDoc);
        }
      }

      // Process the documents and perform other logic
      const { ids, metadatas, documentContents } = processDocuments(docs);

      console.log(docs);

      const embedder = new TransformersEmbeddingFunction();
      const collection = await client.getOrCreateCollection({
        name: "hypzert-dokumentation",
        embeddingFunction: embedder,
      });

      await collection.add({
        ids,
        metadatas,
        documents: documentContents,
      });

      res
        .status(200)
        .json({
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
    const id = uuidv4(); // You would define this function to create a unique ID for each document
    ids.push(id);

    // You may need to customize the metadata extraction based on your needs
    const metadata = {
      title:
        document.metadata.pdf.info.Title ||
        path.basename(document.metadata.source),
      page: document.metadata.loc.pageNumber, // Define this function to extract chapter info
      source: document.metadata.source, // Define this function to extract verse info
    };
    metadatas.push(metadata);

    // Add the page content to the documents array
    documentContents.push(document.pageContent);
  }

  return { ids, metadatas, documentContents };
}
