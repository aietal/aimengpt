import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { ConversationalRetrievalQAChain } from "langchain/chains";

import { ChatBody, Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
import axios from 'axios';

export const config = {
  runtime: 'edge',
};

// create type interface 
interface DocumentInfo {
  id: string;
  text: string;
  metadata: {
    title: string;
    page: string;
  };
}

async function fetchDocuments(input: string) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/fetch-documents',
      { input },
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetch documents');
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, key, prompt, temperature } =
      (await req.json()) as ChatBody;

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    const lastMessage = messages[messages.length - 1];

    const documents = await fetchDocuments(lastMessage.content);

    const relevantDocuments = documents.data.documents[0].map((doc: any, index: number) => ({
      id: documents.data.ids[0][index],
      text: doc,
      metadata: documents.data.metadatas[0][index],
    })).map((doc: DocumentInfo) => `Title ${doc.metadata.title}, Page ${doc.metadata.page}: ${doc.text}`).join(', ');
    
    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }
    
    const prompt_tokens = encoding.encode(promptToSend);
    
    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];
    
    // Constructing the last message with the relevant documents
    const lastMessageContent = `Respond to the following message: ${lastMessage.content} using the following context: ${relevantDocuments}`;
    const lastMessageTokens = encoding.encode(lastMessageContent);
    tokenCount += lastMessageTokens.length;
    
    // Adding existing messages
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = encoding.encode(message.content);
    
      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        continue; // Skip this message if adding it would exceed the token limit
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }
    
    // Add the constructed last message
    messagesToSend = [...messagesToSend, { role: "user", content: lastMessageContent }];
    

    encoding.free();

    console.log(model, promptToSend, temperatureToUse, key, messagesToSend);



    const stream = await OpenAIStream(
      model,
      promptToSend,
      temperatureToUse,
      key,
      messagesToSend,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
