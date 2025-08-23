import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-large",
});

export async function POST(req) {
  try {
    const { userMessage, conversationHistory } = await req.json();

    if (
      typeof conversationHistory !== "object" ||
      !userMessage ||
      typeof userMessage !== "string"
    ) {
      return Response.json(
        { error: "User Message and Conversation is Required" },
        { status: 400 }
      );
    }

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
        apiKey: process.env.QDRANT_API_KEY,
      }
    );

    const vectorSearcher = vectorStore.asRetriever({
      k: 3,
    });

    const relevantChunks = await vectorSearcher.invoke(userMessage);

    const SYSTEM_PROMPT = `
    You are an AI assistant who helps resolving user query based on the
    context available to you from a PDF file or Text content provided by the user.

    If the Type is pdf then only provide page no and file Name in the response.
    If the Type is text then don't provide page no in response.
    Always mention the 

    Only ans based on the available context provided only but you can summarize it on your own so the ans can be simple to userstand but remember try to make the content original as more as possible
    like you can add or remove 20-30% stuff or make it concise or summarize the ans but the remaining 70-80% should be original content only.

    Rules:
    - Strictly follow the output JSON format
    - Only Give page and fileName if the refType is pdf
    - If the refType is text then do not provide;
    - Alway make sure to do multiple steps of thinking before giving out output.

    Output JSON Format:
    {"page": "PAGE_NUMBER" , "content": "STRING", refType: "STRING" , "fileName": "STRING"}


    Example (if pdf):
    USER: Hey, Whats is Node js ?
    ASSISTANT: { "page": "4", refType: "pdf", fileName: "Nodejs Document", "content": "Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to execute JavaScript code outside of a web browser. Traditionally, JavaScript was confined to client-side web development within browsers. Node.js, built on Google Chrome's V8 JavaScript engine, extends JavaScript's capabilities to server-side and other non-browser environments."  }
    USER: From Where I can download Node js ?
    ASSISTANT: { "page": "5", refType: "pdf", fileName: "Nodejs Document", "content": "Node.js can be downloaded from its official website, nodejs.org." }

    Example (if text): 
    USER: Hey, Whats is Node js ?
    ASSISTANT: { refType: "text", "content": "Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to execute JavaScript code outside of a web browser. Traditionally, JavaScript was confined to client-side web development within browsers. Node.js, built on Google Chrome's V8 JavaScript engine, extends JavaScript's capabilities to server-side and other non-browser environments."  }
    USER: From Where I can download Node js ?
    ASSISTANT: { refType: "text", "content": "Node.js can be downloaded from its official website, nodejs.org." }

    Example (if the question is out of the context or just a casual hi hello type or general user message): 
    USER: Hey ?
    ASSISTANT: { "content": "Hello, How are you" }
    USER: I am fine, what about you ?
    ASSISTANT: { "content": "Well everything is superb, how can i help you today" }

    Context:
    ${JSON.stringify(relevantChunks)}
    `;

    let messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: messages,
    });

    const rawContent = response.choices[0].message.content;
    console.log("rawContent : ", rawContent);
    const parsedContent = JSON.parse(rawContent);

    return Response.json(
      { success: true, content: parsedContent },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
}
