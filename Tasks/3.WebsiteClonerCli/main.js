import "dotenv/config";
import { OpenAI } from "openai";
import getStaticSiteClone from "./utils/getStaticSiteClone.js";
import getIsSiteDynamic from "./utils/getIsSiteDynamic.js";

const TOOL_MAP = {
  getIsSiteDynamic: getIsSiteDynamic,
  getStaticSiteClone: getStaticSiteClone,
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    - getIsSiteDynamic(url : string) : Returns whether the site is Dynamic (i.e., Dymically rendered using js, client side rendering, etc.) if dynamic output will be { success: true, message: "dynamic" } and if static output will be like { success: true, message: "static" } and if it is not able to determine then it will return { success: false, message: "not able to determine" };
    - getStaticSiteClone(url : string) : Scraps he static site and clone all the files in a folder and returns { "code" : INT, "failedCount" : INT , "downloadedCount" : INT , "folderPath" : STRING, "message" : "STRING" ,}
    Here are the code that getStaticSiteClone can return: 0 - No problems occurred,1 - Generic error,2 - Parse error,4 - Network failure,5 - SSL verification failure,6 - Authentication failure,7 - Protocol error, 8 - Server error response.
    the getStaticSiteClone can returns the code 8 when anyone file failed to download so there is the possibility that the scraped site is working in this case the failedCount should be check there will also a downloadCount there can be some files that are not loaded but that should not stops the working of the site

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from tool.

    Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL", "content": "string", "tool_name" : "string", "tool_input" : "string"}

    Example:
    User: Hey can you scrap this website ssmiudyog.com
    ASSISTANT: { "step" : "START", "content" : "The user wants me to scrap or clone the website ssmiudyog.com" }
    ASSISTANT: { "step" : "THINK", "content" : "First, I have to determine whether the site is dynamic (i.e.,is there React or any dynamic rendering used) or static (i.e., is it simple HTML, CSS, JS) website" }
    ASSISTANT: { "step" : "THINK", "content" : "Let me check if there is any tool available for this." }
    ASSISTANT: { "step" : "THINK", "content" : "I see that there is a tool available getIsSiteDynamic which returns true if site is Dynamically rendered using react or any SPA and false if it is Static" }
    ASSISTANT: { "step" : "THINK", "content" : "I need to call getIsSiteDynamic to know whether the site is dynamic or not" }
    ASSISTANT: { "step" : "TOOL", "tool_input": "ssmiudyog.com", "tool_name" : "getIsSiteDynamic" }
    DEVELOPER: { "step" : "OBSERVE", "content" : "false, the site is static." }
    ASSISTANT: { "step" : "THINK", "content" : "Great, now i know the is Static"}
    ASSISTANT: { "step" : "THINK", "content" : "Let me check if there is any tool available that can scrap or clone static websites"}
    ASSISTANT: { "step" : "THINK", "content" : "I see that there is a tool available getStaticSiteClone which scraps the site, clones all the files, stores it in a folder and returns the directory path" }
    ASSISTANT: { "step" : "TOOL", "tool_input" : "ssmiudyog.com", "tool_name" : "getStaticSiteClone" }
    DEVELOPER: { "step" : "OBSERVE", "content" : "{ "code" : 0, "failedCount" : 18 , "downloadedCount" : 71 , "folderPath" : "./cloned-site/ssmiudyog.com", "message" : "Wget process finished successfully!" ,}"}
    ASSISTANT: { "step" : "THINK", "content" : "Great, the wait is over and I have got the folder path"}
    ASSISTANT: { "step" : "OUTPUT", "content" : "The site is successfully scraped or cloned and stored at : 'cloned-site/ssmiudyog.com'"}

    Example:
    User: Hey can you scrap this website srimscop.com
    ASSISTANT: { "step" : "START", "content" : "The user wants me to scrap or clone the website srimscop.com" }
    ASSISTANT: { "step" : "THINK", "content" : "First, I have to determine whether the site is dynamic (i.e.,is there React or any dynamic rendering used) or static (i.e., is it simple HTML, CSS, JS) website" }
    ASSISTANT: { "step" : "THINK", "content" : "Let me check if there is any tool available for this." }
    ASSISTANT: { "step" : "THINK", "content" : "I see that there is a tool available getIsSiteDynamic which returns true if site is Dynamically rendered using react or any SPA and false if it is Static" }
    ASSISTANT: { "step" : "THINK", "content" : "I need to call getIsSiteDynamic to know whether the site is dynamic or not" }
    ASSISTANT: { "step" : "TOOL", "tool_input": "srimscop.com", "tool_name" : "getIsSiteDynamic" }
    DEVELOPER: { "step" : "OBSERVE", "content" : "false, the site is static." }
    ASSISTANT: { "step" : "THINK", "content" : "Great, now i know the is Static"}
    ASSISTANT: { "step" : "THINK", "content" : "Let me check if there is any tool available that can scrap or clone static websites"}
    ASSISTANT: { "step" : "THINK", "content" : "I see that there is a tool available getStaticSiteClone which scraps the site, clones all the files, stores it in a folder and returns the directory path" }
    ASSISTANT: { "step" : "TOOL", "tool_input" : "srimscop.com", "tool_name" : "getStaticSiteClone" }
    DEVELOPER: { "step" : "OBSERVE", "content" : "{ "code" : 8, "failedCount" : 12 , "downloadedCount" : 60 , "folderPath" : "./cloned-site/srimscop.com", "message" : "Wget failed with exit code 8"}"}
    ASSISTANT: { "step" : "THINK", "content" : "Great, the wait is over and I have got the folder path"}
    ASSISTANT: { "step" : "OUTPUT", "content" : "The site is successfully scraped or cloned at : 'cloned-site/srimscop.com but 12 files failed to load due to Server error response'"}
    `;

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: "Can you clone this site for me https://www.piyushgarg.dev/",
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

      const responseFromTool = await TOOL_MAP[toolToCall](parsedContent.tool_input);
      // console.log(
      //   `🛠️: ${toolToCall}(${parsedContent.tool_input}) = `,
      //   responseFromTool
      // );

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

  console.log("Done...");
}

main();
