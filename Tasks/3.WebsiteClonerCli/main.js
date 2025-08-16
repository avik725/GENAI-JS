import "dotenv/config";
import { OpenAI } from "openai";
import { exec } from "node:child_process";

const TOOL_MAP = {
  getIsSiteDynamic: getIsSiteDynamic,
  getStaticSiteClone: getStaticSiteClone,
};

const client = new OpenAI();

async function main() {
  const SYSTEM_PROMPT = `
    You are AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.

    Also, before outputing the final result to user you must check once if everything is correct.
    You also have list of available tools that you can call based on user query.

    For every tool call that you make, wait for the OBSERVATION from the tool which is the
    response from the tool that you called.

    Available Tools:
    - getIsSiteDynamic(url : string) : Returns whether the site is Dynamic (i.e., Dymically rendered using js, client side rendering, etc.)
    - getStaticSiteClone(url : string) : Scraps he static site and clone all the files in a folder and return the directory

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from tool.

    Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL", "content": "string", "tool_name" : "string", "tool_input" : "string"}

    Example:
    User: Hey can you scrap this website piyushgarg.dev
    ASSISTANT: { "step" : "START", "content" : "The user wants me to scrap or clone the website piyushgarg.dev" }
    ASSISTANT: { "step" : "THINK", "content" : "First, I have to determine whether the site is dynamic (i.e.,is there React or any dynamic rendering used) or static (i.e., is it simple HTML, CSS, JS) website" }
    ASSISTANT: { "step" : "THINK", "content" : "Let me check if there is any tool available for this." }
    ASSISTANT: { "step" : "THINK", "content" : "I see that there is a tool available getIsSiteDynamic which returns true if site is Dynamically rendered using react or any SPA and false if it is Static" }
    ASSISTANT: { "step" : "THINK", "content" : "I need to call getIsSiteDynamic to know whether the site is dynamic or not" }
    ASSISTANT: { "step" : "TOOL", "tool_input": "piyushgarg.dev", "tool_name" : "getIsSiteDynamic" }
    DEVELOPER: { "step" : "OBSERVE", "content" : "false, the site is static." }
    ASSISTANT: { "step" : "THINK", "content" : "Great, now i know the is Static"}
    ASSISTANT: { "step" : "THINK", "content" : "Let me check if there is any tool available that can scrap or clone static websites"}
    ASSISTANT: { "step" : "THINK", "content" : "I see that there is a tool available getStaticSiteClone which scraps the site, clones all the files, stores it in a folder and returns the directory path" }
    ASSISTANT: { "step" : "TOOL", "tool_input" : "piyushgarg.dev", "tool_name" : "getStaticSiteClone" }
    DEVELOPER: { "step" : "OBSERVE", "content" : "The website is successfully cloned and stored in path: 'output/www.piyushgarg.dev'"}
    ASSISTANT: { "step" : "THINK", "content" : "Great, the wait is over and I have got the folder path"}
    ASSISTANT: { "step" : "OUTPUT", "content" : "The site is successfully scraped or cloned and stored at : 'output/www.piyush.dev'"}
    `;

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: "Can you clone this site for me piyushgarg.dev",
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
    });

    const rawContent = response.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent);

    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent),
    });

    if (parsedContent.step === "START") {
      console.log(`🔥`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "THINK") {
      console.log(`\t🧠`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "TOOL") {
      const toolToCall = parsedContent.tool_name;
      if (!TOOL_MAP[toolToCall]) {
        messages.push({
          role: "developer",
          content: `There is no such tool as ${toolToCall}`,
        });
        continue;
      }

      const responseFromTool = await TOOL_MAP[toolToCall](parsedContent.input);
      console.log(
        `🛠️: ${toolToCall}(${parsedContent.input}) = `,
        responseFromTool
      );

      messages.push({
        role: "developer",
        content: JSON.stringify({ step: "OBSERVE", content: responseFromTool }),
      });
      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log(`🤖`, parsedContent.content);
      break;
    }
  }

  console.log("Done...")
}

main()