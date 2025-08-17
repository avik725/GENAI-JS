import { exec } from "child_process";

function getStaticSiteClone(url, folderPath = "./cloned-site") {
  return new Promise((resolve, reject) => {
    const logFile = "wget.log";

    exec(`> ${logFile}`, () => {
      const command = `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent -P ${folderPath} ${url} -o ${logFile}`;

      console.log("Starting wget...");

      const child = exec(command, { maxBuffer: 1024 * 1024 * 20 });

      console.log(`Cloning ${url} is in progress...`)

      child.stdout?.on("data", (data) => process.stdout.write(data));
      child.stderr?.on("data", (data) => process.stderr.write(data));

      child.on("close", (code) => {
        const grepCmd = `
          FAILED=$(grep -E "ERROR 404|404 Not Found|403 Forbidden|500 Internal Server Error|ERROR" ${logFile} | wc -l);
          DOWNLOADED=$(grep -c "Saving to:" ${logFile});
          echo "$FAILED $DOWNLOADED";
        `;

        exec(grepCmd, (err, stdout) => {
          let failedCount = 0;
          let downloadedCount = 0;

          if (!err && stdout) {
            const parts = stdout.trim().split(" ");
            failedCount = parseInt(parts[0] || "0", 10);
            downloadedCount = parseInt(parts[1] || "0", 10);
          }

          if (code === 0) {
            resolve({
              code,
              failedCount,
              downloadedCount,
              folderPath: `${folderPath}/${url
                .replace("https://", "")
                .replace("www.", "")}`,
              message: "✅ Wget process finished successfully!",
            });
          } else {
            resolve({
              code,
              failedCount,
              downloadedCount,
              ...(failedCount > downloadedCount && {
                folderPath: `${folderPath}/${url
                  .replace("https://", "")
                  .replace("www.", "")}`,
              }),
              message: `❌ Wget failed with exit code ${code}`,
            });
          }
        });
      });

      child.on("error", (err) => reject(err));
    });
  });
}

export default getStaticSiteClone;
