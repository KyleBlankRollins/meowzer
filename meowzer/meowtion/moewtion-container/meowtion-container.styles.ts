import { css } from "lit";
import { baseStyles } from "../animations/index.js";

export const meowtionContainerStyles = [
  baseStyles,
  css`
    .meowtion-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `,
];
