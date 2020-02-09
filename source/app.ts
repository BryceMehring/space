import '@stylesheet/style.scss';
import { WEBGL } from 'three/examples/jsm/WebGL.js';

const gameCanvas = document.getElementById('game') as HTMLCanvasElement;

if (WEBGL.isWebGL2Available() === true) {
  if ('transferControlToOffscreen' in gameCanvas) {

    const onWindowResize = (): void => {
      gameCanvas.setAttribute('width', window.innerWidth.toString());
      gameCanvas.setAttribute('height', window.innerHeight.toString());
    };

    onWindowResize();

    const offscreen = gameCanvas.transferControlToOffscreen();

    const worker = new Worker('./space/space.worker', { type: 'module' });

    worker.postMessage({ topic: 'canvas', canvas: offscreen }, {
      transfer: [offscreen],
    });

    gameCanvas.addEventListener('wheel', (event) => {
      const deltaY = event.deltaY > 0 ? 1 : -1;
      worker.postMessage({
        topic: 'wheel',
        deltaY,
      });
    });

    gameCanvas.addEventListener('mousedown', () => {
      worker.postMessage({
        topic: 'mousedown'
      });
    });

    gameCanvas.addEventListener('mouseup', () => {
      worker.postMessage({
        topic: 'mouseup'
      });
    });

    gameCanvas.addEventListener('mousemove', (event: MouseEvent) => {
      worker.postMessage({
        topic: 'mousemove',
        event: {
          movementX: event.movementX,
          movementY: event.movementY,
        }
      });
    });

    window.addEventListener('resize', () => {
      onWindowResize();
      worker.postMessage({
        topic: 'resize',
        size: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    });
  } else {
    document
      .querySelector('#no-offscreen-canvas')
      ?.classList
      .remove('hide');
  }
} else {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}




