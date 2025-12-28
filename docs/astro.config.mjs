// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Meowzer",
      description: "Autonomous, animated cats for your web projects",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/KyleBlankRollins/meowzer",
        },
      ],
      sidebar: [
        {
          label: "Meta information",
          items: [
            { label: "About These Docs", slug: "about" },
            { label: "Credits", slug: "credits" },
          ],
        },
        {
          label: "Getting Started",
          items: [
            {
              label: "Introduction",
              slug: "getting-started/introduction",
            },
            {
              label: "Installation",
              slug: "getting-started/installation",
            },
            {
              label: "Quick Start",
              slug: "getting-started/quick-start",
            },
            {
              label: "Your First Cat",
              slug: "getting-started/first-cat",
            },
          ],
        },
        {
          label: "Play",
          items: [
            {
              label: "Understanding Cats",
              slug: "play/understanding-cats",
            },
            {
              label: "Interacting",
              items: [
                {
                  label: "Feeding Cats",
                  slug: "play/interacting/feeding-cats",
                },
                {
                  label: "Playing with Toys",
                  slug: "play/interacting/playing-with-toys",
                },
                {
                  label: "Sharing & Adopting Cats",
                  slug: "play/interacting/sharing-and-adopting",
                },
              ],
            },
          ],
        },
        {
          label: "Tutorials",
          collapsed: true,
          items: [
            {
              label: "Basic Integration",
              slug: "tutorials/basic-integration",
            },
            {
              label: "Persistence Setup",
              slug: "tutorials/persistence-setup",
            },
            {
              label: "Cat Customization",
              slug: "tutorials/customization",
            },
          ],
        },
        {
          label: "Concepts",
          collapsed: true,
          items: [
            {
              label: "Architecture",
              slug: "concepts/architecture",
            },
            {
              label: "Cat Lifecycle",
              slug: "concepts/cat-lifecycle",
            },
            {
              label: "AI Behaviors",
              slug: "concepts/ai-behaviors",
            },
          ],
        },
        {
          label: "Guides",
          collapsed: true,
          items: [
            {
              label: "Customization",
              slug: "guides/customization",
            },
            {
              label: "Performance",
              slug: "guides/performance",
            },
            {
              label: "Best Practices",
              slug: "guides/best-practices",
            },
          ],
        },
        {
          label: "API Reference",
          collapsed: true,
          items: [
            {
              label: "Meowzer SDK",
              slug: "api/meowzer-sdk",
            },
            {
              label: "MeowzerCat",
              slug: "api/meowzer-cat",
            },
            {
              label: "Managers",
              items: [
                {
                  label: "CatManager",
                  slug: "api/managers/cat-manager",
                },
                {
                  label: "StorageManager",
                  slug: "api/managers/storage-manager",
                },
                {
                  label: "InteractionManager",
                  slug: "api/managers/interaction-manager",
                },
              ],
            },
          ],
        },
        {
          label: "Advanced",
          collapsed: true,
          items: [
            {
              label: "Plugin Development",
              slug: "advanced/plugin-development",
            },
            {
              label: "Framework Integration",
              slug: "advanced/framework-integration",
            },
            {
              label: "Code Snippets",
              slug: "examples/code-snippets",
            },
          ],
        },
      ],
    }),
  ],
});
