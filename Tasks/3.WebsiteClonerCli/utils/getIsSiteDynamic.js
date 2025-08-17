// import fetch from "node-fetch";
import axios from "axios";
import * as cheerio from "cheerio";

async function getIsSiteDynamic(url) {
  try {
    const res = await axios(url);

    const page = cheerio.load(res.data);

    if (
      page("#__next").length ||
      page("#root").length ||
      page("#app").length ||
      page("app-root").length
    ) {
      return { success: true, message: "dynamic" };
    }
    const bodyText = page("body").text().trim();
    if (bodyText.length > 50) {
      return { success: true, message: "static" };
    }

    return { success: false, message: "not able to determine" };
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getIsSiteDynamic;
