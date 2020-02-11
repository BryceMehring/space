import { WEBGL } from 'three/examples/jsm/WebGL.js';

export const validateWebGL = (): HTMLElement | undefined => {
  if (WEBGL.isWebGL2Available() !== true) {
    return WEBGL.getWebGL2ErrorMessage();
  }

  const canvas = document.createElement('canvas');

  if (!canvas.transferControlToOffscreen) {
    const errorComponent = document.createElement('div');
    errorComponent.className = 'error';
    errorComponent.innerHTML = `
      <p>
        <strong>
          OffscreenCanvas is not supported. Please use Chrome or see
          <a href="https://caniuse.com/#feat=mdn-api_htmlcanvaselement_transfercontroltooffscreen" target="_blank">https://caniuse.com/#feat=mdn-api_htmlcanvaselement_transfercontroltooffscreen</a>
        </strong>
      </p>`;

    return errorComponent;
  }
};
