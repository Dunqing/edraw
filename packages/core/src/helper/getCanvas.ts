import { createCanvasElement } from "./createCanvas";

export function getCanvasByElement(
  el?: HTMLCanvasElement | string | null
): HTMLCanvasElement {
  if (el instanceof HTMLCanvasElement) {
    return el;
  }
  if (!el) return createCanvasElement();

  const canvas = document.querySelector(el);

  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    return createCanvasElement();
  }

  return canvas;
}
