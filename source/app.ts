import '@stylesheet/style.scss';
import { validateWebGL } from './validator';

const error = validateWebGL();

if (!error) {
  const gameCanvas = document.createElement('canvas');
  gameCanvas.id = "game";

  document.body.appendChild(gameCanvas);

  const onWindowResize = (): void => {
    gameCanvas.setAttribute('width', window.innerWidth.toString());
    gameCanvas.setAttribute('height', window.innerHeight.toString());
  };

  onWindowResize();

  const offscreen = gameCanvas.transferControlToOffscreen();

  const worker = new Worker('./space/space.worker.ts', { type: 'module' });

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
  document.body.appendChild(error);
}
