import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (
      !id ||
      typeof id !== "string"
    ) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    await client.delete(process.env.QDRANT_COLLECTION_NAME, {
      filter: {
        must: [
          { key: "referenceId", match: { value: id } },
        ],
      },  
    });

    return Response.json({success: true, message: "Reference Deleted Successfully...!"})
  } catch (error) {
    console.log(error)
    return Response.json({ error: error.message }, { status: 500 });
  }
}
