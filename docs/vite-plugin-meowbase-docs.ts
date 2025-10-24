import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
// import Shiki from "@shikijs/markdown-it";
import {
  renderHomeTemplate,
  renderLandingTemplate,
  renderDocumentationTemplate,
} from "./source/templates.js";

export interface Frontmatter {
  title: string;
  description: string;
  template?: "Home" | "Landing" | "Documentation";
  banner?: string;
  previous?: string;
  next?: string;
  draft?: boolean;
}

export interface PageData {
  frontmatter: Frontmatter;
  content: string;
  html: string;
  url: string;
  filePath: string;
  template: "Home" | "Landing" | "Documentation";
}

export interface NavItem {
  title: string;
  url: string;
  children?: NavItem[];
  isMeta?: boolean; // Special meta pages (Credits, etc.) shown separately
}

export function meowbaseDocsPlugin(): Plugin {
  const contentDir = path.resolve(process.cwd(), "source/content");
  const isDev = process.env.NODE_ENV !== "production";

  // Cache of all pages
  let pagesCache: Map<string, PageData> | null = null;
  let md: MarkdownIt | null = null;
  let shikiInitialized = false;

  // Initialize markdown-it with Shiki
  async function initializeMarkdown() {
    if (shikiInitialized) return;

    md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });

    // Add Shiki plugin for syntax highlighting
    // Temporarily disabled for testing
    // md.use(
    //   await Shiki({
    //     themes: {
    //       light: "github-light",
    //       dark: "github-dark",
    //     },
    //   })
    // );

    shikiInitialized = true;
  }

  async function buildPagesCache() {
    await initializeMarkdown();

    const pages = new Map<string, PageData>();

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith(".md")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const parsed = matter(content);
          const frontmatter = parsed.data as Frontmatter;

          // Skip drafts in production
          if (!isDev && frontmatter.draft) {
            continue;
          }

          const html = md!.render(parsed.content);
          const relativePath = path.relative(contentDir, fullPath);
          const url = generateUrl(relativePath);
          const template = determineTemplate(
            fullPath,
            frontmatter.template
          );

          pages.set(url, {
            frontmatter,
            content: parsed.content,
            html,
            url,
            filePath: fullPath,
            template,
          });
        }
      }
    }

    scanDir(contentDir);
    return pages;
  }

  async function getPages(): Promise<Map<string, PageData>> {
    if (!pagesCache) {
      pagesCache = await buildPagesCache();
    }
    return pagesCache;
  }

  return {
    name: "meowbase-docs",

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        let url = req.url || "/";

        // Strip query string and hash
        url = url.split("?")[0].split("#")[0];

        // Remove .html extension if present
        if (url.endsWith(".html")) {
          url = url.slice(0, -5);
        }

        // Normalize trailing slashes (remove them except for root)
        if (url !== "/" && url.endsWith("/")) {
          url = url.slice(0, -1);
        }

        // Only handle HTML requests
        if (!req.headers.accept?.includes("text/html")) {
          return next();
        }

        // Rebuild cache on each request in dev mode
        if (isDev) {
          pagesCache = null;
        }

        const pages = await getPages();
        const pageData = pages.get(url);

        if (pageData) {
          const navigation = generateNavigation(contentDir, isDev);
          const props = {
            frontmatter: pageData.frontmatter,
            html: pageData.html,
            url: pageData.url,
            navigation,
          };

          let html: string;
          switch (pageData.template) {
            case "Home":
              html = renderHomeTemplate(props);
              break;
            case "Landing":
              html = renderLandingTemplate(props);
              break;
            case "Documentation":
              html = renderDocumentationTemplate(props);
              break;
          }

          res.setHeader("Content-Type", "text/html");
          res.end(html);
        } else {
          next();
        }
      });
    },

    // Enable HMR for markdown files
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".md")) {
        // Clear cache
        pagesCache = null;

        // Trigger full reload for markdown changes
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },

    // Generate static HTML files during build - runs AFTER Vite finishes
    async closeBundle() {
      if (isDev) return;

      const outDir = path.resolve(process.cwd(), "dist");
      const pages = await getPages();
      const navigation = generateNavigation(contentDir, isDev);

      // Generate HTML for each page
      for (const [url, pageData] of pages) {
        const props = {
          frontmatter: pageData.frontmatter,
          html: pageData.html,
          url: pageData.url,
          navigation,
        };

        let html: string;
        switch (pageData.template) {
          case "Home":
            html = renderHomeTemplate(props);
            break;
          case "Landing":
            html = renderLandingTemplate(props);
            break;
          case "Documentation":
            html = renderDocumentationTemplate(props);
            break;
        }

        // Determine output path
        let outputPath: string;
        if (url === "/") {
          outputPath = path.join(outDir, "index.html");
        } else {
          // Create directory for pretty URLs (e.g., /about -> /about/index.html)
          const dirPath = path.join(outDir, url);
          fs.mkdirSync(dirPath, { recursive: true });
          outputPath = path.join(dirPath, "index.html");
        }

        // Write HTML file
        fs.writeFileSync(outputPath, html, "utf-8");
        console.log(`Generated: ${outputPath}`);
      }

      console.log(`\nBuilt ${pages.size} pages to ${outDir}`);
    },
  };
}

/**
 * Generate URL from file path
 * source/content/index.md -> /
 * source/content/getting-started/index.md -> /getting-started
 * source/content/getting-started/installation.md -> /getting-started/installation
 */
function generateUrl(relativePath: string): string {
  let url = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");

  // Handle index files BEFORE adding leading slash
  if (url.endsWith("/index") || url === "index") {
    url = url.replace(/index$/, "");
    // Remove trailing slash unless it's the root
    if (url.length > 1 && url.endsWith("/")) {
      url = url.slice(0, -1);
    }
  }

  // Ensure leading slash (after handling index)
  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  // Root case - if we have just a slash or empty, return root
  if (url === "/" || url === "") {
    url = "/";
  }

  return url;
}

/**
 * Determine template based on file path and frontmatter
 */
function determineTemplate(
  filePath: string,
  frontmatterTemplate?: string
): "Home" | "Landing" | "Documentation" {
  // Use frontmatter template if specified
  if (frontmatterTemplate) {
    return frontmatterTemplate as
      | "Home"
      | "Landing"
      | "Documentation";
  }

  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  const contentDir = path.resolve(process.cwd(), "source/content");

  // Root index.md is Home template
  if (dirName === contentDir && fileName === "index.md") {
    return "Home";
  }

  // Other index.md files are Landing templates
  if (fileName === "index.md") {
    return "Landing";
  }

  // Everything else is Documentation template
  return "Documentation";
}

/**
 * Generate navigation structure from content directory
 */
function generateNavigation(
  contentDir: string,
  isDev: boolean
): NavItem[] {
  function scanDirectory(
    dir: string,
    baseUrl: string = ""
  ): NavItem[] {
    const items: NavItem[] = [];

    if (!fs.existsSync(dir)) {
      return items;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Check for index.md in this directory
        const indexPath = path.join(fullPath, "index.md");
        if (fs.existsSync(indexPath)) {
          const indexContent = fs.readFileSync(indexPath, "utf-8");
          const parsed = matter(indexContent);
          const frontmatter = parsed.data as Frontmatter;

          // Skip drafts in production
          if (!isDev && frontmatter.draft) {
            continue;
          }

          const url = `${baseUrl}/${entry.name}`;
          const children = scanDirectory(fullPath, url);

          items.push({
            title: frontmatter.title || prettifyName(entry.name),
            url,
            children: children.length > 0 ? children : undefined,
          });
        } else {
          // Directory without index.md - still scan children
          const children = scanDirectory(
            fullPath,
            `${baseUrl}/${entry.name}`
          );
          if (children.length > 0) {
            items.push({
              title: prettifyName(entry.name),
              url: `${baseUrl}/${entry.name}`,
              children,
            });
          }
        }
      } else if (
        entry.name.endsWith(".md") &&
        entry.name !== "index.md" &&
        entry.name !== "credits.md" // Exclude credits.md - it's added as a meta page
      ) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const parsed = matter(content);
        const frontmatter = parsed.data as Frontmatter;

        // Skip drafts in production
        if (!isDev && frontmatter.draft) {
          continue;
        }

        const name = entry.name.replace(/\.md$/, "");
        const url = `${baseUrl}/${name}`;

        items.push({
          title: frontmatter.title || prettifyName(name),
          url,
        });
      }
    }

    return items;
  }

  const navigation = scanDirectory(contentDir);

  // Add special "meta" pages at the bottom with visual separation
  const creditsPath = path.join(contentDir, "credits.md");
  if (fs.existsSync(creditsPath)) {
    const content = fs.readFileSync(creditsPath, "utf-8");
    const parsed = matter(content);
    const frontmatter = parsed.data as Frontmatter;

    // Skip drafts in production
    if (isDev || !frontmatter.draft) {
      navigation.push({
        title: frontmatter.title || "Credits",
        url: "/credits",
        isMeta: true, // Mark as special meta page
      });
    }
  }

  return navigation;
}

/**
 * Prettify folder/file names
 * getting-started -> Getting Started
 */
function prettifyName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
