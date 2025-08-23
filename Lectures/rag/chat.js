import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chat() {
  const userQuery =
    "How much stipend E-Katta Innovators LLP was offering to Avinash and then was his response ?";

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-large",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "chaicode-collection",
    }
  );

  const vectorSearcher = vectorStore.asRetriever({
    k: 3,
  });

  const relevantChunks = await vectorSearcher.invoke(userQuery);

  const SYSTEM_PROMPT = `
  You are an AI assistant who helps resolving user query based on the
  context available to you from a PDF file with the content and page number.

  Only ans based on the available cntext from file only.

  Context:
  ${JSON.stringify(relevantChunks)}
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ],
  });

  console.log(response.choices[0].message.content);
}

chat();
