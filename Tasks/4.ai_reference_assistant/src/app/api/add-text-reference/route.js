import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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
    const { content, username } = await req.json();

    if (!content.trim()) {
      return Response.json(
        { error: "Text Content Is Required" },
        { status: 400 }
      );
    }

    if (!username || typeof username !== "string") {
      return Response.json({ error: "Username is required" }, { status: 400 });
    }

    const points = [];
    const referenceId = Number(
      `${Date.now()}${Math.floor(Math.random() * 1000000)}`
    );

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });
    const texts = await textSplitter.splitText(content);

    for (let i = 0; i < texts.length; i++) {
      const vector = await embeddings.embedQuery(texts[i]);
      const id = Number(`${Date.now()}${(i + 1)*10}`)

      points.push({
        id: id,
        vector,
        payload: {
          content: texts[i],
          username: username,
          referenceId: `${referenceId}`,
          metadata: {
            type: "text",
          },
        },
      });
    }

    // upsert into Qdrant
    await client.upsert(process.env.QDRANT_COLLECTION_NAME, {
      wait: true,
      points: points
    });

    return Response.json({
      success: true,
      referenceType: "text",
    });
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
