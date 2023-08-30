import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";
import { codeBlock, oneLine } from 'common-tags'

import { ChatBody, Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

export const config = {
  runtime: 'edge',
};

// Function to fetch and format documents
async function fetchAndFormatDocuments(lastMessageContent: string) {
  try {
    console.log("fetching documents")
    const response = await fetch('http://localhost:3000/api/fetch-documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: lastMessageContent }),
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching documents: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.metadatas[0].map((metadata: any, index: number) => {
      return `Source ${index + 1}) Title: ${metadata.title}, Page: ${metadata.page}, Content: ${data.documents[0][index]}\n`;
    }).join('');

    console.log(result);

    return result;

  } catch (error) {
    console.error('Error fetching and formatting documents:', error);
    throw error; // You may want to throw a more specific error object here
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

    let promptToSend = codeBlock`
    ${oneLine`
      You are a very enthusiastic AI assistant  who loves
      to help people! Given the following information from
      relevant documentation, answer the user's question using
      only that information, outputted in markdown format.
    `}

    ${oneLine`
      If you are unsure
      and the answer is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that."
    `}
    
    ${oneLine`
      Always include citations from the documentation.
    `}
  `;

    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    const lastMessage = messages[messages.length - 1];

    const relevantDocuments = await fetchAndFormatDocuments(lastMessage.content);
    
    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

    const prompt_tokens = encoding.encode(promptToSend);

    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];

    // Constructing the last message with the relevant documents
    // const lastMessageContent = `Respond to the following message: ${lastMessage.content} using the following context: ${relevantDocuments}`;
    // const lastMessageTokens = encoding.encode(lastMessageContent);
    // tokenCount += lastMessageTokens.length;

    // Adding existing messages
    // for (let i = messages.length - 1; i >= 0; i--) {
    //   const message = messages[i];
    //   const tokens = encoding.encode(message.content);

    //   if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
    //     continue; // Skip this message if adding it would exceed the token limit
    //   }
    //   tokenCount += tokens.length;
    //   messagesToSend = [message, ...messagesToSend];
    // }

    // Add the constructed last message
  

    encoding.free();

    console.log(model, promptToSend, temperatureToUse, key, messagesToSend);

    // const messageToSend = codeBlock`
    //   ${oneLine`
    //     You are a very enthusiastic AI assistant who loves
    //     to help people! Given the following sections from relevant
    //     documentation, answer the question using only that information,
    //     outputted in markdown format. You must in the same language as the question. If you are unsure and the answer
    //     is not explicitly written in the documentation, say
    //     "Sorry, I don't know how to help with that."
    //   `}

    //   Context sections:
    //   ${relevantDocuments}

    //   Question: """
    //   ${lastMessage.content}
    //   """

    //   Answer as markdown (including related code snippets if available):
    // `

    // messagesToSend = [
    //   { role: 'user', content: messageToSend },
    // ];

  messagesToSend = [
      {
        role: "user",
        content: codeBlock`
          Here is the relevant documentation:
          ${relevantDocuments}
        `,
      },
      {
        role: "user",
        content: codeBlock`
          ${oneLine`
            Answer my next question using only the above documentation.
            You must also follow the below rules when answering:
          `}
          ${oneLine`
            - Do not make up answers that are not provided in the documentation.
          `}
          ${oneLine`
            - If you are unsure and the answer is not explicitly written
            in the documentation context, say
            "Sorry, I don't know how to help with that."
          `}
          ${oneLine`
            - Prefer splitting your response into multiple paragraphs.
          `}
          ${oneLine`
            - Output as markdown with citations based on the documentation.
          `}
        `,
      },
      {
        role: "user",
        content: codeBlock`
          Here is my question:
          ${oneLine`${lastMessage.content}`}
      `,
      },
    ]


    const stream = await OpenAIStream(
      model,
      promptToSend,
      0,
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
