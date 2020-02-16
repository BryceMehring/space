import { WEBGL } from 'three/examples/jsm/WebGL.js';

export const validateWebGL = (): string | null => {
  if (WEBGL.isWebGL2Available() !== true) {
    return WEBGL.getWebGL2ErrorMessage().textContent;
  }

  const canvas = document.createElement('canvas');

  if (!canvas.transferControlToOffscreen) {
    return 'OffscreenCanvas is not supported';
  }

  return null;
};
