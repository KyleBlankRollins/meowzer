/**
 * Client-Side Router for Meowbase Docs
 *
 * Intercepts internal link navigation and swaps page content via AJAX
 * instead of doing a full page reload. This keeps the cat playground
 * container alive across navigation, preserving cat state naturally.
 */

const TEMPLATE_SELECTORS = [
  "mb-home-template",
  "mb-landing-template",
  "mb-doc-template",
];

/**
 * Initialize the client-side router
 */
export function initializeRouter(): void {
  // Intercept all link clicks - use capture phase to catch events from shadow DOM
  document.addEventListener("click", handleLinkClick, true);

  // Handle browser back/forward buttons
  window.addEventListener("popstate", handlePopState);

  console.log("Client-side router initialized");
}

/**
 * Handle link clicks
 */
async function handleLinkClick(event: MouseEvent): Promise<void> {
  // Get the actual clicked element (might be inside shadow DOM)
  const composedPath = event.composedPath();
  let link: HTMLAnchorElement | null = null;

  // Walk up the composed path to find an anchor element
  for (const element of composedPath) {
    if (element instanceof HTMLAnchorElement) {
      link = element;
      break;
    }
  }

  // Only handle internal links
  if (!link || !isInternalLink(link)) {
    return;
  }

  // Don't handle links that open in new tab/window
  if (link.target === "_blank" || event.metaKey || event.ctrlKey) {
    return;
  }

  console.log("Router intercepting navigation to:", link.href);
  event.preventDefault();
  event.stopPropagation();

  const url = link.href;
  await navigateToUrl(url, true);
}

/**
 * Handle browser back/forward navigation
 */
async function handlePopState(): Promise<void> {
  const url = window.location.href;
  await navigateToUrl(url, false);
}

/**
 * Navigate to a URL by fetching and swapping content
 */
async function navigateToUrl(
  url: string,
  pushState: boolean
): Promise<void> {
  try {
    // Fetch the new page HTML
    const response = await fetch(url, {
      headers: {
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.statusText}`
      );
    }

    const html = await response.text();

    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Update the page
    updatePage(doc);

    // Update browser URL and history
    if (pushState) {
      window.history.pushState({}, "", url);
    }

    // Scroll to top (or hash if present)
    const hash = new URL(url).hash;
    if (hash) {
      const element = document.querySelector(hash);
      element?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  } catch (error) {
    console.error(
      "Navigation failed, falling back to full page load:",
      error
    );
    window.location.href = url;
  }
}

/**
 * Update the current page with content from the new page
 */
function updatePage(newDoc: Document): void {
  // Update title
  document.title = newDoc.title;

  // Update meta tags
  updateMetaTags(newDoc);

  // Find and replace the template component
  const oldTemplate = findTemplateElement(document);
  const newTemplate = findTemplateElement(newDoc);

  if (oldTemplate && newTemplate) {
    console.log(
      "Replacing template:",
      oldTemplate.tagName,
      "→",
      newTemplate.tagName
    );

    // Verify cat playground exists and will persist
    const playground = document.getElementById("cat-playground");
    const playgroundCats = playground
      ? Array.from(playground.children)
      : [];
    console.log(
      "Cat playground exists:",
      !!playground,
      "Children:",
      playground?.children.length
    );
    console.log(
      "Cat IDs before replacement:",
      playgroundCats.map((c) => c.id)
    );

    // Check if the new document has a playground too
    const newPlayground = newDoc.getElementById("cat-playground");
    console.log(
      "New document has playground?",
      !!newPlayground,
      "Children:",
      newPlayground?.children.length
    );

    // Replace the entire template component
    oldTemplate.replaceWith(newTemplate);

    // Verify playground still exists after replacement
    const playgroundAfter = document.getElementById("cat-playground");
    const playgroundCatsAfter = playgroundAfter
      ? Array.from(playgroundAfter.children)
      : [];
    console.log(
      "Cat playground after replacement:",
      !!playgroundAfter,
      "Children:",
      playgroundAfter?.children.length
    );
    console.log(
      "Cat IDs after replacement:",
      playgroundCatsAfter.map((c) => c.id)
    );

    // Check if playground is the same instance
    console.log(
      "Is same playground element?",
      playground === playgroundAfter
    );

    // Update nav active state
    updateNavigation(newDoc);
  } else {
    console.warn(
      "Could not find template elements, falling back to full reload"
    );
    throw new Error("Template not found");
  }
}

/**
 * Find the template element in a document
 */
function findTemplateElement(doc: Document): Element | null {
  for (const selector of TEMPLATE_SELECTORS) {
    const element = doc.querySelector(selector);
    if (element) {
      return element;
    }
  }
  return null;
}

/**
 * Update meta tags in the head
 */
function updateMetaTags(newDoc: Document): void {
  // Update description meta tag
  const oldDescription = document.querySelector(
    'meta[name="description"]'
  );
  const newDescription = newDoc.querySelector(
    'meta[name="description"]'
  );

  if (oldDescription && newDescription) {
    oldDescription.setAttribute(
      "content",
      newDescription.getAttribute("content") || ""
    );
  }
}

/**
 * Update navigation active states
 */
function updateNavigation(newDoc: Document): void {
  // Update mb-nav component
  const oldNav = document.querySelector("mb-nav");
  const newNav = newDoc.querySelector("mb-nav");

  if (oldNav && newNav) {
    const newCurrentUrl = newNav.getAttribute("data-current-url");
    if (newCurrentUrl) {
      oldNav.setAttribute("data-current-url", newCurrentUrl);
    }
  }

  // Update mb-sidebar component if present
  const oldSidebar = document.querySelector("mb-sidebar");
  const newSidebar = newDoc.querySelector("mb-sidebar");

  if (oldSidebar && newSidebar) {
    const newCurrentUrl = newSidebar.getAttribute("data-current-url");
    if (newCurrentUrl) {
      oldSidebar.setAttribute("data-current-url", newCurrentUrl);
    }
  }
}

/**
 * Check if a link is internal to this site
 */
function isInternalLink(link: HTMLAnchorElement): boolean {
  // Same origin?
  if (link.origin !== window.location.origin) {
    return false;
  }

  // Links to files (not HTML pages)
  const pathname = link.pathname;
  if (pathname.match(/\.(pdf|zip|jpg|png|gif|svg|css|js)$/i)) {
    return false;
  }

  return true;
}
