import "dotenv/config";

import { OpenAI } from "openai";

const client = new OpenAI();

async function init() {
  const result = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: "Your text string goes here",
    encoding_format: "float",
  });
  console.log(result);
}

init();
