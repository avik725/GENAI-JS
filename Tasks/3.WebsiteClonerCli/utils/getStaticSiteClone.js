import { exec } from "child_process";

async function getStaticSiteClone(url, folderPath = "./cloned-site") {
  const command = `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent -P ${folderPath} ${url}`;

  console.log("▶ Starting wget...");

  const child = exec(command, { maxBuffer: 1024 * 1024 * 10 });

  child.stdout?.on("data", (data) => process.stdout.write(data));
  child.stderr?.on("data", (data) => process.stderr.write(data));

  child.on("close", (code) => {
    if (code === 0) {
      console.log("\n✅ Wget process finished successfully!");
    } else {
      console.error(`\n❌ Wget failed with exit code ${code}`);
    }
  });
}

export default getStaticSiteClone;
