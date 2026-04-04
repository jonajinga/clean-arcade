import { DateTime } from "luxon";
import rssPlugin from "@11ty/eleventy-plugin-rss";
import tinyHTML from "@sardine/eleventy-plugin-tinyhtml";
import Image from "@11ty/eleventy-img";
import fs from "fs";
import path from "path";

export default function (eleventyConfig) {
  // --- Plugins ---
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(tinyHTML);

  // --- Image shortcode ---
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, sizes = "100vw") {
    const metadata = await Image(src, {
      widths: [400, 800, 1200],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
      filenameFormat: (id, src, width, format) => {
        const name = path.basename(src, path.extname(src));
        return `${name}-${width}w.${format}`;
      },
    });
    const imageAttributes = { alt, sizes, loading: "lazy", decoding: "async" };
    return Image.generateHTML(metadata, imageAttributes);
  });

  // --- Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return array;
    return n < 0 ? array.slice(n) : array.slice(0, n);
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("striptags", (str) => {
    if (!str) return "";
    return str.replace(/<[^>]+>/g, "");
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 225));
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("truncate", (str, len) => {
    if (!str || str.length <= len) return str;
    return str.substring(0, len).replace(/\s+\S*$/, "") + "...";
  });

  eleventyConfig.addFilter("rejectattr", (arr, attr, val) => {
    if (!Array.isArray(arr)) return arr;
    return arr.filter((item) => item[attr] !== val);
  });

  eleventyConfig.addFilter("startsWith", (str, prefix) => {
    if (!str) return false;
    return str.startsWith(prefix);
  });

  eleventyConfig.addFilter("where", (arr, key, val) => {
    if (!Array.isArray(arr)) return arr;
    return arr.filter((item) => item[key] === val);
  });

  eleventyConfig.addFilter("shuffle", (arr) => {
    if (!Array.isArray(arr)) return arr;
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  eleventyConfig.addFilter("dump", (obj) => JSON.stringify(obj));

  // --- CSS Concatenation ---
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      if (parsed.name !== "global") return;

      return async () => {
        const cssDir = path.join("src", "assets", "css");
        const order = ["reset.css", "tokens.css", "utilities.css"];
        let output = "";

        // Core files in order
        for (const file of order) {
          try {
            output += fs.readFileSync(path.join(cssDir, file), "utf-8") + "\n";
          } catch (e) {
            /* skip missing */
          }
        }

        // Component CSS (alphabetical)
        const compDir = path.join(cssDir, "components");
        try {
          const compFiles = fs.readdirSync(compDir).filter((f) => f.endsWith(".css")).sort();
          for (const file of compFiles) {
            output += fs.readFileSync(path.join(compDir, file), "utf-8") + "\n";
          }
        } catch (e) {
          /* skip if dir missing */
        }

        // Page CSS (alphabetical)
        const pageDir = path.join(cssDir, "pages");
        try {
          const pageFiles = fs.readdirSync(pageDir).filter((f) => f.endsWith(".css")).sort();
          for (const file of pageFiles) {
            output += fs.readFileSync(path.join(pageDir, file), "utf-8") + "\n";
          }
        } catch (e) {
          /* skip if dir missing */
        }

        return output;
      };
    },
  });

  // --- Passthrough Copy ---
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy({ "src/games/_src": "games/_src" });
  eleventyConfig.addPassthroughCopy({ "src/manifest.json": "manifest.json" });

  // --- Collections ---
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/blog/posts/**/*.md").reverse();
  });

  // --- Watch targets ---
  eleventyConfig.addWatchTarget("src/assets/css/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "css"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
