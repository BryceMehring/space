import SpaceWorker from 'worker-loader!./space.worker';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
const gameCanvas = document.getElementById('game') as HTMLCanvasElement;

if (WEBGL.isWebGL2Available() === true) {
  if (gameCanvas && ('transferControlToOffscreen' in gameCanvas)) {

    const onWindowResize = (): void => {
      gameCanvas.setAttribute('width', window.innerWidth.toString());
      gameCanvas.setAttribute('height', window.innerHeight.toString());
    };

    onWindowResize();

    const offscreen = gameCanvas.transferControlToOffscreen();

    const worker = new SpaceWorker();

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
    /*gameCanvas.addEventListener('mousedown', onMouseDown);
    gameCanvas.addEventListener('mouseup', onMouseUp);
    gameCanvas.addEventListener('mousemove', onMouseMove);*/

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

