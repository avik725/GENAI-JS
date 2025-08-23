import { QdrantClient } from "@qdrant/js-client-rest";
import { match } from "assert";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { username } = body;
    console.log(username);

    if (!username || typeof username !== "string") {
      return Response.json({ error: "Username required" }, { status: 400 });
    }

    const scrollRes = await client.scroll(process.env.QDRANT_COLLECTION_NAME, {
      filter: {
        must: [{ key: "username", match: { value: username } }],
      },
      with_payload: true,
    });

    const vectors = scrollRes.points || [];

    const referencesMap = new Map();

    vectors.forEach((v) => {
      const md = v.payload.metadata;
      if (!referencesMap.has(v.payload.referenceId)) {
        referencesMap.set(v.payload.referenceId, {
          id: v.payload.referenceId,
          type: md.type,
          fileName: md.fileName || null,
          url: md.url || null,
        });
      }
    });

    const references = Array.from(referencesMap.values());
    return Response.json({ success: true, references });
  } catch (err) {
    console.error("Fetch references error:", err);
    return Response.json(
      { error: "Failed to fetch references" },
      { status: 500 }
    );
  }
}
