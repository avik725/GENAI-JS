import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-large",
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdfFile");
    const username = formData.get("username");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Convert uploaded file to Node stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🚀 Use LangChain PDFLoader (works with buffer)
    const loader = new PDFLoader(new Blob([buffer]), {
      splitPages: true, // har page alag milega
    });

    const docs = await loader.load();

    // ✅ Ensure Qdrant collection exists
    const isCollectionExist = await client.collectionExists(
      process.env.QDRANT_COLLECTION_NAME
    );

    if (!isCollectionExist.exists) {
      await client.createCollection(process.env.QDRANT_COLLECTION_NAME, {
        vectors: { size: 3072, distance: "Cosine" },
      });
    }

    const referenceId = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    const points = [];

    for (let i = 0; i < docs.length; i++) {
      const vector = await embeddings.embedQuery(docs[i].pageContent);
      const id = Number(`${Date.now()}${(i + 1) * 10}`);

      points.push({
        id,
        vector,
        payload: {
          content: docs[i].pageContent,
          username,
          referenceId,
          metadata: {
            ...docs[i].metadata,
            type: "pdf",
            fileName: file.name.trim(),
          },
        },
      });
    }

    await client.upsert(process.env.QDRANT_COLLECTION_NAME, {
      wait: true,
      points,
    });

    return Response.json({
      success: true,
      fileName: file.name,
      fileType: "pdf",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
}
