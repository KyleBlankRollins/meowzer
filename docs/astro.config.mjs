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
          label: "Tutorials",
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
          label: "API Reference",
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
              ],
            },
          ],
        },
        {
          label: "Resources",
          items: [{ label: "Credits", slug: "credits" }],
        },
      ],
    }),
  ],
});
