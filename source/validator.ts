import { WEBGL } from 'three/examples/jsm/WebGL.js';

const offscreenCanvasErrorMessage = 'OffscreenCanvas is not supported';

export const validateWebGL = (): string | null => {
  if (WEBGL.isWebGL2Available() !== true) {
    return WEBGL.getWebGL2ErrorMessage().textContent;
  }

  const canvas = document.createElement('canvas');

  if (!canvas.transferControlToOffscreen) {
    return offscreenCanvasErrorMessage;
  }

  try {
    canvas.transferControlToOffscreen();
  } catch(e) {
    return offscreenCanvasErrorMessage;
  }

  return null;
};
