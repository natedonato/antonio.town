const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const inspect = require("util").inspect;
// const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
// const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const Image = require("@11ty/eleventy-img");



module.exports = function (eleventyConfig) {
  // 	eleventyConfig.addShortcode("image", async function(src, alt, sizes = "100vw") {
  // 	// if(alt === undefined) {
  // 	// 	// You bet we throw an error on missing alt (alt="" works okay)
  // 	// 	throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  // 	// }
  // 	let metadata = await Image(src, {
  // 		widths: [300, 600],
  // 		formats: ['webp', 'jpeg']
  // 	});

  // 	let lowsrc = metadata.jpeg[0];
  // 	let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  // 	return `<picture>
  // 		${Object.values(metadata).map(imageFormat => {
  // 			return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  // 		}).join("\n")}
  // 			<img
  // 				src="${lowsrc.url}"
  // 				width="${highsrc.width}"
  // 				height="${highsrc.height}"
  // 				alt="${alt}"
  // 				loading="lazy"
  // 				decoding="async">
  // 		</picture>`;
  // });

  // // --- START, eleventy-img
  // function imageShortcode(src, alt, sizes = "(min-width: 1024px) 100vw, 50vw") {
  //   console.log(`Generating image(s) from:  ${src}`);
  //   let options = {
  //     widths: [600, 900, 1500],
  //     formats: ["webp", "jpeg"],
  //     urlPath: "./static/img/",
  //     outputDir: "./_site/static/img/",
  //     filenameFormat: function (id, src, width, format, options) {
  //       const extension = path.extname(src);
  //       const name = path.basename(src, extension);
  //       return `${name}-${width}w.${format}`;
  //     },
  //   };

  //   // generate images
  //   Image(src, options);

  //   let imageAttributes = {
  //     alt,
  //     sizes,
  //     loading: "lazy",
  //     decoding: "async",
  //   };
  //   // get metadata
  //   metadata = Image.statsSync(src, options);
  //   return Image.generateHTML(metadata, imageAttributes);
  // }
  // eleventyConfig.addShortcode("image", imageShortcode);
  // // --- END, eleventy-img

  // // // WebC
  // // eleventyConfig.addPlugin(eleventyWebcPlugin, {
  // //   components: [
  // //     // …
  // //     // Add as a global WebC component
  // //     "npm:@11ty/eleventy-img/*.webc",
  // //   ],
  // // });

  // // // Image plugin
  // // eleventyConfig.addPlugin(eleventyImagePlugin, {
  // //   // Set global default options
  // //   formats: ["webp", "jpeg"],
  // //   urlPath: "/img/",

  // //   // Notably `outputDir` is resolved automatically
  // //   // to the project output directory

  // //   defaultAttributes: {
  // //     loading: "lazy",
  // //     // decoding: "async",
  // //   },
  // // });

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .minus({ hours: 19 })
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
