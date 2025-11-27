import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { tokens } from "../shared/design-tokens.js";

const meta = {
  title: "Design System/Design Tokens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Design Tokens

The foundation of the Meowzer design system. These tokens define the visual language including colors, typography, spacing, and more.

### Philosophy

- **Playful & Light**: Soft pastel colors and rounded corners create a friendly, approachable interface
- **Cat-Themed**: Whimsical design choices that reflect the playful nature of cats
- **Accessible**: Maintains readability and contrast while staying light and cheerful
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Color Palette Story
export const Colors: Story = {
  render: () => html`
    <div style="font-family: ${tokens.fontFamily};">
      <h2 style="margin-bottom: 2rem;">Color Palette</h2>

      <!-- Brand Colors -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Brand Colors</h3>
        <p
          style="color: ${tokens.colorTextSecondary}; margin-bottom: 1rem;"
        >
          Primary colors that define the Meowzer brand identity.
        </p>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"
        >
          <div>
            <div
              style="height: 100px; background: ${tokens.colorBrandPrimary}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Brand Primary
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorBrandPrimary</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorBrandSecondary}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Brand Secondary
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorBrandSecondary</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorBrandAccent}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Brand Accent
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorBrandAccent</code
            >
          </div>
        </div>
      </section>

      <!-- Surface Colors -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Surface Colors</h3>
        <p
          style="color: ${tokens.colorTextSecondary}; margin-bottom: 1rem;"
        >
          Background and surface colors for components and layouts.
        </p>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"
        >
          <div>
            <div
              style="height: 100px; background: ${tokens.colorSurfaceDefault}; border: 1px solid ${tokens.colorBorderSubtle}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Surface Default
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorSurfaceDefault</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorSurfaceSubtle}; border: 1px solid ${tokens.colorBorderSubtle}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Surface Subtle
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorSurfaceSubtle</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorSurfaceHover}; border: 1px solid ${tokens.colorBorderSubtle}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Surface Hover
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorSurfaceHover</code
            >
          </div>
        </div>
      </section>

      <!-- Status Colors -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Status Colors</h3>
        <p
          style="color: ${tokens.colorTextSecondary}; margin-bottom: 1rem;"
        >
          Semantic colors for feedback and status indication.
        </p>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"
        >
          <div>
            <div
              style="height: 100px; background: ${tokens.colorStatusSuccess}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Success
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorStatusSuccess</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorStatusWarning}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Warning
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorStatusWarning</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorStatusError}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Error
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorStatusError</code
            >
          </div>
          <div>
            <div
              style="height: 100px; background: ${tokens.colorStatusInfo}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall};"
            ></div>
            <p
              style="margin-top: 0.5rem; font-weight: ${tokens.fontWeightMedium};"
            >
              Info
            </p>
            <code style="font-size: ${tokens.fontSizeSmall};"
              >colorStatusInfo</code
            >
          </div>
        </div>
      </section>

      <!-- Text & Border Colors -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Text & Border Colors</h3>
        <p
          style="color: ${tokens.colorTextSecondary}; margin-bottom: 1rem;"
        >
          Colors for text content and component borders.
        </p>
        <div
          style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;"
        >
          <div>
            <h4>Text Colors</h4>
            <div
              style="display: flex; flex-direction: column; gap: 0.5rem;"
            >
              <div
                style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
              >
                <span style="color: ${tokens.colorTextPrimary};"
                  >Primary Text</span
                >
                <code
                  style="display: block; font-size: ${tokens.fontSizeSmall}; margin-top: 0.25rem;"
                  >colorTextPrimary</code
                >
              </div>
              <div
                style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
              >
                <span style="color: ${tokens.colorTextSecondary};"
                  >Secondary Text</span
                >
                <code
                  style="display: block; font-size: ${tokens.fontSizeSmall}; margin-top: 0.25rem;"
                  >colorTextSecondary</code
                >
              </div>
              <div
                style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
              >
                <span style="color: ${tokens.colorTextDisabled};"
                  >Disabled Text</span
                >
                <code
                  style="display: block; font-size: ${tokens.fontSizeSmall}; margin-top: 0.25rem;"
                  >colorTextDisabled</code
                >
              </div>
            </div>
          </div>
          <div>
            <h4>Border Colors</h4>
            <div
              style="display: flex; flex-direction: column; gap: 0.5rem;"
            >
              <div
                style="padding: 1rem; border: 2px solid ${tokens.colorBorderSubtle}; border-radius: ${tokens.radiusSmall};"
              >
                <span>Subtle Border</span>
                <code
                  style="display: block; font-size: ${tokens.fontSizeSmall}; margin-top: 0.25rem;"
                  >colorBorderSubtle</code
                >
              </div>
              <div
                style="padding: 1rem; border: 2px solid ${tokens.colorBorderDefault}; border-radius: ${tokens.radiusSmall};"
              >
                <span>Default Border</span>
                <code
                  style="display: block; font-size: ${tokens.fontSizeSmall}; margin-top: 0.25rem;"
                  >colorBorderDefault</code
                >
              </div>
              <div
                style="padding: 1rem; border: 2px solid ${tokens.colorBorderStrong}; border-radius: ${tokens.radiusSmall};"
              >
                <span>Strong Border</span>
                <code
                  style="display: block; font-size: ${tokens.fontSizeSmall}; margin-top: 0.25rem;"
                  >colorBorderStrong</code
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
};

// Typography Story
export const Typography: Story = {
  render: () => html`
    <div style="font-family: ${tokens.fontFamily};">
      <h2 style="margin-bottom: 2rem;">Typography</h2>

      <!-- Font Family -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Font Family</h3>
        <div
          style="padding: 1.5rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusMedium};"
        >
          <p
            style="font-size: ${tokens.fontSizeLarge}; margin-bottom: 0.5rem;"
          >
            The quick brown cat jumps over the lazy dog
          </p>
          <code style="font-size: ${tokens.fontSizeSmall};"
            >${tokens.fontFamily}</code
          >
        </div>
      </section>

      <!-- Font Sizes -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Font Sizes</h3>
        <div
          style="display: flex; flex-direction: column; gap: 1rem;"
        >
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p
              style="font-size: ${tokens.fontSizeXLarge}; margin: 0;"
            >
              Extra Large (${tokens.fontSizeXLarge})
            </p>
          </div>
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p style="font-size: ${tokens.fontSizeLarge}; margin: 0;">
              Large (${tokens.fontSizeLarge})
            </p>
          </div>
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p
              style="font-size: ${tokens.fontSizeMedium}; margin: 0;"
            >
              Medium (${tokens.fontSizeMedium})
            </p>
          </div>
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p style="font-size: ${tokens.fontSize}; margin: 0;">
              Base (${tokens.fontSize})
            </p>
          </div>
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p style="font-size: ${tokens.fontSizeSmall}; margin: 0;">
              Small (${tokens.fontSizeSmall})
            </p>
          </div>
        </div>
      </section>

      <!-- Font Weights -->
      <section style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Font Weights</h3>
        <div
          style="display: flex; flex-direction: column; gap: 1rem;"
        >
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p
              style="font-weight: ${tokens.fontWeightNormal}; margin: 0;"
            >
              Normal (${tokens.fontWeightNormal})
            </p>
          </div>
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p
              style="font-weight: ${tokens.fontWeightMedium}; margin: 0;"
            >
              Medium (${tokens.fontWeightMedium})
            </p>
          </div>
          <div
            style="padding: 1rem; background: ${tokens.colorSurfaceSubtle}; border-radius: ${tokens.radiusSmall};"
          >
            <p
              style="font-weight: ${tokens.fontWeightBold}; margin: 0;"
            >
              Bold (${tokens.fontWeightBold})
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
};

// Spacing Story
export const Spacing: Story = {
  render: () => html`
    <div style="font-family: ${tokens.fontFamily};">
      <h2 style="margin-bottom: 2rem;">Spacing Scale</h2>
      <div
        style="display: flex; flex-direction: column; gap: 1.5rem;"
      >
        ${[1, 2, 3, 4, 5, 6, 7, 8].map(
          (num) => html`
            <div>
              <p
                style="margin: 0 0 0.5rem 0; font-weight: ${tokens.fontWeightMedium};"
              >
                Space ${num} (${(tokens as any)[`space${num}`]})
              </p>
              <div
                style="height: ${(tokens as any)[
                  `space${num}`
                ]}; background: ${tokens.colorBrandPrimary}; border-radius: ${tokens.radiusSmall};"
              ></div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

// Border Radius Story
export const BorderRadius: Story = {
  render: () => html`
    <div style="font-family: ${tokens.fontFamily};">
      <h2 style="margin-bottom: 2rem;">Border Radius</h2>
      <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2rem;"
      >
        <div>
          <div
            style="width: 120px; height: 120px; background: ${tokens.colorBrandPrimary}; border-radius: ${tokens.radiusNone}; box-shadow: ${tokens.shadowMedium};"
          ></div>
          <p
            style="margin-top: 1rem; font-weight: ${tokens.fontWeightMedium};"
          >
            None (${tokens.radiusNone})
          </p>
        </div>
        <div>
          <div
            style="width: 120px; height: 120px; background: ${tokens.colorBrandSecondary}; border-radius: ${tokens.radiusSmall}; box-shadow: ${tokens.shadowMedium};"
          ></div>
          <p
            style="margin-top: 1rem; font-weight: ${tokens.fontWeightMedium};"
          >
            Small (${tokens.radiusSmall})
          </p>
        </div>
        <div>
          <div
            style="width: 120px; height: 120px; background: ${tokens.colorBrandAccent}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowMedium};"
          ></div>
          <p
            style="margin-top: 1rem; font-weight: ${tokens.fontWeightMedium};"
          >
            Medium (${tokens.radiusMedium})
          </p>
        </div>
        <div>
          <div
            style="width: 120px; height: 120px; background: ${tokens.colorStatusSuccess}; border-radius: ${tokens.radiusLarge}; box-shadow: ${tokens.shadowMedium};"
          ></div>
          <p
            style="margin-top: 1rem; font-weight: ${tokens.fontWeightMedium};"
          >
            Large (${tokens.radiusLarge})
          </p>
        </div>
        <div>
          <div
            style="width: 120px; height: 120px; background: ${tokens.colorStatusWarning}; border-radius: ${tokens.radiusFull}; box-shadow: ${tokens.shadowMedium};"
          ></div>
          <p
            style="margin-top: 1rem; font-weight: ${tokens.fontWeightMedium};"
          >
            Full (${tokens.radiusFull})
          </p>
        </div>
      </div>
    </div>
  `,
};

// Shadows Story
export const Shadows: Story = {
  render: () => html`
    <div style="font-family: ${tokens.fontFamily};">
      <h2 style="margin-bottom: 2rem;">Shadows</h2>
      <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 3rem;"
      >
        <div>
          <div
            style="width: 200px; height: 120px; background: ${tokens.colorSurfaceDefault}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowSmall}; display: flex; align-items: center; justify-content: center;"
          >
            <span style="font-weight: ${tokens.fontWeightMedium};"
              >Small</span
            >
          </div>
          <code
            style="font-size: ${tokens.fontSizeSmall}; display: block; margin-top: 1rem;"
            >${tokens.shadowSmall}</code
          >
        </div>
        <div>
          <div
            style="width: 200px; height: 120px; background: ${tokens.colorSurfaceDefault}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowMedium}; display: flex; align-items: center; justify-content: center;"
          >
            <span style="font-weight: ${tokens.fontWeightMedium};"
              >Medium</span
            >
          </div>
          <code
            style="font-size: ${tokens.fontSizeSmall}; display: block; margin-top: 1rem;"
            >${tokens.shadowMedium}</code
          >
        </div>
        <div>
          <div
            style="width: 200px; height: 120px; background: ${tokens.colorSurfaceDefault}; border-radius: ${tokens.radiusMedium}; box-shadow: ${tokens.shadowLarge}; display: flex; align-items: center; justify-content: center;"
          >
            <span style="font-weight: ${tokens.fontWeightMedium};"
              >Large</span
            >
          </div>
          <code
            style="font-size: ${tokens.fontSizeSmall}; display: block; margin-top: 1rem;"
            >${tokens.shadowLarge}</code
          >
        </div>
      </div>
    </div>
  `,
};
