import SpaceWorker from './space.worker';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
const gameCanvas = document.getElementById('game');

if (WEBGL.isWebGL2Available() === true) {
  if ('transferControlToOffscreen' in gameCanvas) {

    const onWindowResize = () => {
      gameCanvas.setAttribute('width', window.innerWidth);
      gameCanvas.setAttribute('height', window.innerHeight);
    };

    onWindowResize(gameCanvas);

    const offscreen = gameCanvas.transferControlToOffscreen();

    const worker = new SpaceWorker();

    worker.postMessage({ topic: 'canvas', canvas: offscreen }, [offscreen]);

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
      .classList
      .remove('hide');
  }
} else {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}


