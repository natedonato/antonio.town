const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const inspect = require("util").inspect;
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {

	eleventyConfig.addShortcode("image", async function (src, alt, loading = "lazy") {
    // if (alt === undefined) {
    //   // You bet we throw an error on missing alt (alt="" works okay)
    //   throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    // }
    // widths:
    // 600+: og xl
    // 541-600: 400px l
    // 441-540: 320px m
    // 375-440: 268px s
    // 321-374: 225px xs
    let minWidths = ["600", "541", "441", "375"];

    let metadata = await Image(src, {
      widths: [225, 268, 320, 400, "auto"],
      formats: ["webp"],
      urlPath: "/static/img/",
      outputDir: "./_site/static/img/",
      sharpOptions: {
        animated: true,
      },
    });
    // console.log(metadata)

    let sizes = metadata.webp;
    let [xs, s, m, l, xl] = sizes;
    for (let i = 1; i < sizes.length; i++) {
      if (sizes[i].size === 0) {
        sizes[i] = sizes[i - 1];
      }
    }


    // img srcset version
    let srcSet = "";
    for(let i = 0; i < sizes.length; i++){
      srcSet += sizes[i].url;
      srcSet += " " + sizes[i].width + "w, ";
    };
    srcSet = srcSet.substring(0, srcSet.length - 2);

    let sizeStr = `min(80vw - 18px, ${xl.width}px, 942px)`;

    let htmlSerial = `<img width="${xl.width}" height="${xl.height}" src="${xl.url}" srcset="${srcSet}" sizes="${sizeStr}" alt="${alt}" loading="${loading}" decoding="async">`;
    return htmlSerial

    // picture version
    // let htmlSerial = "<picture>";
    // sizes = sizes.reverse();

    // for (let i = 0; i < 4; i++) {
    //   htmlSerial += `<source srcset="${sizes[i].url}" media="(min-width: ${minWidths[i]}px)">`;
    // }

    // htmlSerial += `<img src="${sizes[4].url}" width="${sizes[0].width}" height="${sizes[0].height}" alt="${alt}" loading="lazy" decoding="async">`;
    // htmlSerial += "</picture>";

    // return htmlSerial;
  });


  // sizes
  // min(80vw - 18px), ___px, 942px)

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .toFormat("dd LLL yyyy");
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
  });

  eleventyConfig.addPassthroughCopy("./src/static/css/global.css");

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addFilter(
    "debug",
    (content) => `<pre>${inspect(content)}</pre>`
  );

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
