import type {
  Frontmatter,
  NavItem,
} from "../vite-plugin-meowbase-docs.ts";

export interface TemplateProps {
  frontmatter: Frontmatter;
  html: string;
  url: string;
  navigation: NavItem[];
}

/**
 * Get the sidebar component HTML
 */
function getSidebarHTML(
  navigation: NavItem[],
  currentUrl: string
): string {
  return `<mb-sidebar
    slot="sidebar"
    data-navigation="${JSON.stringify(navigation).replace(
      /"/g,
      "&quot;"
    )}"
    data-current-url="${currentUrl}"
  ></mb-sidebar>`;
}

/**
 * Base HTML shell with Carbon Web Components
 */
function createBaseTemplate(
  props: TemplateProps,
  templateContent: string
): string {
  // Extract top-level navigation links (only index.md pages from subdirectories, exclude meta pages)
  const topNavLinks = props.navigation
    .filter((item) => !item.isMeta)
    .map((item) => ({
      title: item.title,
      url: item.url,
    }));

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.frontmatter.title} | Meowzer</title>
        <meta name="description" content="${
          props.frontmatter.description || ""
        }" />
        <script>
          // Apply Carbon dark theme class immediately to prevent flash
          (function() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.classList.add('cds-theme-g90');
            } else {
              document.documentElement.classList.add('cds-theme-g10');
            }
            
            // Listen for theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
              if (e.matches) {
                document.documentElement.classList.remove('cds-theme-g10');
                document.documentElement.classList.add('cds-theme-g90');
              } else {
                document.documentElement.classList.remove('cds-theme-g90');
                document.documentElement.classList.add('cds-theme-g10');
              }
            });
          })();
        </script>
        <link rel="stylesheet" href="/source/style.css" />
        <script type="module" src="/source/main.ts"></script>
      </head>
      <body>
        <mb-nav
          data-links="${JSON.stringify(topNavLinks).replace(
            /"/g,
            "&quot;"
          )}"
          data-current-url="${props.url}"
          data-site-title="Meowzer 🐱"
        ></mb-nav>
        ${templateContent}
      </body>
    </html>`;
}

/**
 * Home template - Root landing page
 */
export function renderHomeTemplate(props: TemplateProps): string {
  const templateContent = `<mb-home-template
    data-frontmatter="${JSON.stringify(props.frontmatter).replace(
      /"/g,
      "&quot;"
    )}"
  >
    <div slot="content">${props.html}</div>
  </mb-home-template>`;

  return createBaseTemplate(props, templateContent);
}

/**
 * Landing template - Section landing pages
 */
export function renderLandingTemplate(props: TemplateProps): string {
  const templateContent = `<mb-landing-template
    data-frontmatter="${JSON.stringify(props.frontmatter).replace(
      /"/g,
      "&quot;"
    )}"
  >
    ${getSidebarHTML(props.navigation, props.url)}
    <div slot="content">${props.html}</div>
  </mb-landing-template>`;

  return createBaseTemplate(props, templateContent);
}

/**
 * Documentation template - Regular content pages
 */
export function renderDocumentationTemplate(
  props: TemplateProps
): string {
  const templateContent = `<mb-doc-template
    data-frontmatter="${JSON.stringify(props.frontmatter).replace(
      /"/g,
      "&quot;"
    )}"
  >
    ${getSidebarHTML(props.navigation, props.url)}
    <div slot="content">${props.html}</div>
  </mb-doc-template>`;

  return createBaseTemplate(props, templateContent);
}
