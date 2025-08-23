import 'dotenv/config'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function init() {
  const pdfFilePath = "./rag/demo.pdf";
  const loader = new PDFLoader(pdfFilePath);

  const docs = await loader.load();

  // Ready the client OpenAI Embedding Model
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-large",
  });

  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "chaicode-collection",
  });

  console.log("Indexing of documents done...");
}

init();
