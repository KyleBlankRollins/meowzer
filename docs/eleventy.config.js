/**
 * Eleventy Configuration for Meowzer Documentation
 *
 * This configuration file sets up the Meowzer documentation site with:
 * - 11ty for static site generation
 * - Vite for client-side asset bundling
 * - Nunjucks templates with layout chaining
 * - Markdown with syntax highlighting and anchor links
 * - Collections for automatic navigation generation
 * - Custom filters and shortcodes for enhanced content
 *
 * @see https://www.11ty.dev/docs/config/
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig - 11ty configuration object
 * @returns {Object} 11ty configuration options
 */
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export default function (eleventyConfig) {
  // ==========================================
  // PLUGINS
  // ==========================================

  // Add Vite plugin for dev server and build processing
  // The plugin automatically scans HTML for asset references and processes them
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      clearScreen: false,
      server: {
        middlewareMode: true,
      },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: "assets/[name]-[hash][extname]",
            chunkFileNames: "assets/[name]-[hash].js",
            entryFileNames: "assets/[name]-[hash].js",
          },
        },
      },
    },
  });

  // Add syntax highlighting for code blocks
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      tabindex: 0,
    },
  });

  // ==========================================
  // MARKDOWN CONFIGURATION
  // ==========================================

  // Configure markdown-it with useful features
  const markdownLibrary = markdownIt({
    html: true, // Allow HTML in Markdown
    breaks: false, // Don't convert \n to <br>
    linkify: true, // Auto-convert URLs to links
    typographer: true, // Smart quotes and other nice typography
  }).use(markdownItAnchor, {
    // Add anchor links to headings
    level: [1, 2, 3, 4], // Which heading levels get anchors
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "heading-anchor",
      symbol: "#",
    }),
    slugify: (s) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
  });

  eleventyConfig.setLibrary("md", markdownLibrary);

  // ==========================================
  // FILTERS
  // ==========================================

  // Add dump filter for JSON serialization (like Jinja2/Django)
  eleventyConfig.addFilter("dump", (obj) => {
    if (obj === undefined || obj === null) {
      return "{}";
    }
    return JSON.stringify(obj).replace(/"/g, "&quot;");
  });

  // Add markdown filter for inline markdown rendering
  eleventyConfig.addFilter("markdown", (content) => {
    return markdownLibrary.render(content);
  });

  // Add markdownInline filter for single-line markdown (no <p> wrapper)
  eleventyConfig.addFilter("markdownInline", (content) => {
    return markdownLibrary.renderInline(content);
  });

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", (date, format = "long") => {
    const d = new Date(date);
    if (format === "short") {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Reading time filter - estimates reading time based on word count
  eleventyConfig.addFilter("readingTime", (content) => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]+>/g, ""); // Strip HTML
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  });

  // Excerpt filter - creates a short excerpt from content
  eleventyConfig.addFilter("excerpt", (content, maxLength = 160) => {
    const text = content.replace(/<[^>]+>/g, ""); // Strip HTML
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  });

  // Limit filter - limit array length
  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  // ==========================================
  // SHORTCODES
  // ==========================================

  // Alert/callout shortcode for warnings, tips, notes
  // Usage: {% alert "warning" %}This is a warning!{% endalert %}
  eleventyConfig.addPairedShortcode(
    "alert",
    (content, type = "info") => {
      return `<div class="alert alert-${type}">${content}</div>`;
    }
  );

  // Code example shortcode with optional title
  // Usage: {% codeExample "TypeScript" %}...code...{% endcodeExample %}
  eleventyConfig.addPairedShortcode(
    "codeExample",
    (code, language = "", title = "") => {
      const titleHtml = title
        ? `<div class="code-title">${title}</div>`
        : "";
      return `${titleHtml}<pre class="language-${language}"><code class="language-${language}">${code}</code></pre>`;
    }
  );

  // ==========================================
  // INPUT/OUTPUT DIRECTORIES
  // ==========================================

  // Input: source/content (our Markdown files)
  // Output: _site (11ty default, we'll use dist later with Vite integration)

  // ==========================================
  // PASSTHROUGH COPY
  // ==========================================

  // Copy public assets to output
  eleventyConfig.addPassthroughCopy("public");

  // ==========================================
  // MARKDOWN CONFIGURATION
  // ==========================================

  // Using default markdown-it configuration for now
  // We'll enhance this in Phase 5 with syntax highlighting and other plugins

  // ==========================================
  // COLLECTIONS
  // ==========================================

  // Create a collection for top-level navigation (main sections)
  eleventyConfig.addCollection("topNav", function (collectionApi) {
    const items = [];
    const content = collectionApi.getFilteredByGlob(
      "source/content/*/index.md"
    );

    for (const item of content) {
      // Skip meta pages and root index
      if (item.url === "/" || item.data.isMeta) {
        continue;
      }

      items.push({
        title: item.data.title,
        url: item.url,
      });
    }

    return items;
  });

  // Create a hierarchical navigation structure
  eleventyConfig.addCollection(
    "navigation",
    function (collectionApi) {
      const allPages = collectionApi.getAll();
      const sections = {};

      for (const page of allPages) {
        // Skip pages without URLs, drafts, or meta pages
        if (!page.url || page.data.draft || page.data.isMeta) {
          continue;
        }

        // Parse the URL path
        const parts = page.url.split("/").filter(Boolean);

        if (parts.length === 0) {
          // Skip root page in navigation
          continue;
        } else if (parts.length === 1) {
          // Top-level section index (e.g., /docs/, /api/)
          const sectionKey = parts[0];
          if (!sections[sectionKey]) {
            sections[sectionKey] = {
              title: page.data.title || sectionKey,
              url: page.url,
              children: [],
            };
          } else {
            // Update title if section exists
            sections[sectionKey].title =
              page.data.title || sectionKey;
            sections[sectionKey].url = page.url;
          }
        } else {
          // Nested page (e.g., /docs/getting-started/quick-start/)
          const sectionKey = parts[0];

          // Ensure section exists
          if (!sections[sectionKey]) {
            sections[sectionKey] = {
              title: sectionKey,
              url: `/${sectionKey}/`,
              children: [],
            };
          }

          // For nested pages, check if it's a subsection index or a regular page
          if (
            parts.length === 2 &&
            page.url.endsWith(`/${parts[1]}/`)
          ) {
            // This is a subsection index (e.g., /docs/getting-started/)
            // Check if this subsection already exists in children
            let subsection = sections[sectionKey].children.find(
              (child) => child.url === page.url
            );

            if (!subsection) {
              subsection = {
                title: page.data.title || parts[1],
                url: page.url,
                children: [],
              };
              sections[sectionKey].children.push(subsection);
            } else {
              // Update existing subsection
              subsection.title = page.data.title || parts[1];
            }
          } else if (parts.length >= 2) {
            // This is a page within a subsection (e.g., /docs/getting-started/quick-start/)
            const subsectionPath = `/${parts[0]}/${parts[1]}/`;

            // Find or create the subsection
            let subsection = sections[sectionKey].children.find(
              (child) => child.url === subsectionPath
            );

            if (!subsection) {
              subsection = {
                title: parts[1],
                url: subsectionPath,
                children: [],
              };
              sections[sectionKey].children.push(subsection);
            }

            // Add this page to the subsection if it's not the subsection index
            if (page.url !== subsectionPath) {
              subsection.children.push({
                title: page.data.title || parts[parts.length - 1],
                url: page.url,
              });
            }
          }
        }
      }

      return Object.values(sections);
    }
  );

  // Add credits as a special meta page
  eleventyConfig.addCollection("metaPages", function (collectionApi) {
    return collectionApi.getFilteredByGlob(
      "source/content/credits.md"
    );
  });

  // ==========================================
  // DATA CASCADE: COMPUTED DATA
  // ==========================================

  // Automatically set layout based on template frontmatter or file location
  eleventyConfig.addGlobalData("eleventyComputed", {
    layout: (data) => {
      // If layout is already set in frontmatter, use it
      if (data.layout) {
        return data.layout;
      }

      // If template is specified in frontmatter, use it
      if (data.template) {
        const templateMap = {
          Home: "layouts/home.njk",
          Landing: "layouts/landing.njk",
          Documentation: "layouts/documentation.njk",
        };
        return (
          templateMap[data.template] || "layouts/documentation.njk"
        );
      }

      // Otherwise, determine layout based on file path
      const inputPath = data.page.inputPath;

      // Root index.md is Home
      if (inputPath.endsWith("/content/index.md")) {
        return "layouts/home.njk";
      }

      // Other index.md files are Landing pages
      if (inputPath.endsWith("/index.md")) {
        return "layouts/landing.njk";
      }

      // Everything else is Documentation
      return "layouts/documentation.njk";
    },
  });

  // ==========================================
  // PERFORMANCE OPTIMIZATIONS
  // ==========================================

  // Watch for changes in public assets
  eleventyConfig.addWatchTarget("./public/styles/**/*.css");
  eleventyConfig.addWatchTarget("./public/scripts/**/*.js");

  // Quiet mode for cleaner output (optional)
  eleventyConfig.setQuietMode(false);

  // ==========================================
  // CONFIGURATION OBJECT
  // ==========================================

  return {
    // Set template formats to process
    templateFormats: ["md", "njk", "html"],

    // Set Markdown as default template engine for HTML files
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "source/content", // Where our content lives
      output: "_site", // Where 11ty outputs
      includes: "../_includes", // Layouts and partials (relative to input)
      data: "../_data", // Global data files (relative to input)
    },
  };
}
