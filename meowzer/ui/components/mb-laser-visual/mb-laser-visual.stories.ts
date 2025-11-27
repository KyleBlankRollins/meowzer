import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-laser-visual.js";

const meta: Meta = {
  title: "Components/Laser Visual",
  component: "mb-laser-visual",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 400px; background: #f5f5f5;"
    >
      <mb-laser-visual
        active
        style="transform: translate(200px, 150px);"
      ></mb-laser-visual>
      <div
        style="position: absolute; top: 20px; left: 20px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
      >
        <h3 style="margin: 0 0 8px 0;">Laser Pointer Dot</h3>
        <p style="margin: 0; color: #666; font-size: 0.875rem;">
          Red dot with radial gradient glow effect
        </p>
      </div>
    </div>
  `,
};

export const Inactive: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 400px; background: #f5f5f5; display: flex; align-items: center; justify-content: center;"
    >
      <mb-laser-visual></mb-laser-visual>
      <div style="text-align: center;">
        <h3 style="margin: 0 0 8px 0;">Inactive Laser</h3>
        <p style="margin: 0; color: #666; font-size: 0.875rem;">
          Laser visual is hidden when not active
        </p>
      </div>
    </div>
  `,
};

export const ActiveState: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 400px; background: #f5f5f5;"
    >
      <mb-laser-visual
        active
        style="transform: translate(300px, 200px);"
      ></mb-laser-visual>
      <div
        style="position: absolute; top: 20px; left: 20px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
      >
        <h3 style="margin: 0 0 8px 0;">Active Laser</h3>
        <p style="margin: 0; color: #666; font-size: 0.875rem;">
          Visible when <code>active</code> attribute is present
        </p>
      </div>
    </div>
  `,
};

export const MultiplePositions: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 600px; background: #f5f5f5;"
    >
      <mb-laser-visual
        active
        style="transform: translate(150px, 100px);"
      ></mb-laser-visual>

      <mb-laser-visual
        active
        style="transform: translate(400px, 200px);"
      ></mb-laser-visual>

      <mb-laser-visual
        active
        style="transform: translate(650px, 150px);"
      ></mb-laser-visual>

      <mb-laser-visual
        active
        style="transform: translate(300px, 400px);"
      ></mb-laser-visual>

      <div
        style="position: absolute; top: 20px; left: 20px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
      >
        <h3 style="margin: 0 0 8px 0;">Multiple Laser Dots</h3>
        <p style="margin: 0; color: #666; font-size: 0.875rem;">
          Multiple lasers at different positions<br />
          (Note: In practice, only one laser is active at a time)
        </p>
      </div>
    </div>
  `,
};

export const OnDarkBackground: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 400px; background: #1a1a1a;"
    >
      <mb-laser-visual
        active
        style="transform: translate(200px, 150px);"
      ></mb-laser-visual>

      <mb-laser-visual
        active
        style="transform: translate(500px, 200px);"
      ></mb-laser-visual>

      <div
        style="position: absolute; top: 20px; left: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; backdrop-filter: blur(10px);"
      >
        <h3 style="margin: 0 0 8px 0; color: white;">
          Dark Background
        </h3>
        <p
          style="margin: 0; color: rgba(255,255,255,0.7); font-size: 0.875rem;"
        >
          Laser dots are highly visible on dark surfaces
        </p>
      </div>
    </div>
  `,
};

export const WithPlayground: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 600px; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);"
    >
      <mb-laser-visual
        active
        style="transform: translate(400px, 300px);"
      ></mb-laser-visual>

      <!-- Mock playground elements -->
      <div
        style="position: absolute; left: 100px; top: 150px; width: 80px; height: 80px; background: #8B4513; border-radius: 8px;"
      ></div>
      <div
        style="position: absolute; left: 600px; top: 200px; width: 60px; height: 60px; background: #4682B4; border-radius: 50%;"
      ></div>
      <div
        style="position: absolute; left: 350px; top: 450px; width: 50px; height: 50px; background: #FF6B6B; border-radius: 50%;"
      ></div>

      <div
        style="position: absolute; top: 20px; left: 20px; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
      >
        <h3 style="margin: 0 0 8px 0;">Playground Context</h3>
        <p style="margin: 0; color: #666; font-size: 0.875rem;">
          Laser dot in a playground environment<br />
          Cats would chase this red dot!
        </p>
      </div>
    </div>
  `,
};

export const AnimationDemo: Story = {
  render: () => html`
    <div
      style="position: relative; width: 100vw; height: 400px; background: #2a2a2a;"
    >
      <mb-laser-visual
        active
        style="transform: translate(300px, 200px);"
      ></mb-laser-visual>

      <div
        style="position: absolute; top: 20px; left: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; backdrop-filter: blur(10px);"
      >
        <h3 style="margin: 0 0 12px 0; color: white;">
          Glow Animation
        </h3>
        <ul
          style="margin: 0; padding-left: 20px; color: rgba(255,255,255,0.8); font-size: 0.875rem;"
        >
          <li>Pulsing center dot (0.8s cycle)</li>
          <li>Outer glow animation (1.5s cycle)</li>
          <li>Radial gradient with multiple stops</li>
          <li>White highlight for realism</li>
        </ul>
      </div>
    </div>
  `,
};
