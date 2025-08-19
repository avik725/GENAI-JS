import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function cloneDynamicSite(url, folderPath = "./dynamic-clone") {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("▶ Opening browser...");
  await page.goto(url, { waitUntil: "networkidle" });

  // Assets save karna
  page.on("response", async (response) => {
    try {
      const reqUrl = response.url();
      const headers = response.headers();
      const contentType = headers["content-type"] || "";

      if (
        contentType.includes("text/css") ||
        contentType.includes("javascript") ||
        contentType.includes("image") ||
        contentType.includes("font")
      ) {
        const buffer = await response.body();

        // Path decide karo
        let pathname = new URL(reqUrl).pathname;
        if (pathname.endsWith("/")) pathname += "index.html";

        const filePath = path.join(folderPath, pathname);

        // Folder create karo
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        fs.writeFileSync(filePath, buffer);
        console.log("📥 Saved:", filePath);
      }
    } catch (err) {
      // kuch requests fail bhi ho sakte hain
    }
  });

  // HTML content save
  const html = await page.content();
  fs.writeFileSync(path.join(folderPath, "index.html"), html);

  console.log("✅ Rendered page + assets saved!");
  await browser.close();
}

cloneDynamicSite("https://www.piyushgarg.dev/");
