import '@stylesheet/style.scss';
import { validateWebGL } from './validator';
import { showError } from './errors';

const error = validateWebGL();

if (!error) {
  const gameCanvas = document.querySelector<HTMLCanvasElement>('#game');

  if (!gameCanvas) {
    throw new Error('cannot find game canvas');
  }

  const onWindowResize = (): void => {
    gameCanvas.setAttribute('width', window.innerWidth.toString());
    gameCanvas.setAttribute('height', window.innerHeight.toString());
  };

  onWindowResize();

  const offscreen = gameCanvas.transferControlToOffscreen();

  const worker = new Worker('./space/space.worker.ts', { type: 'module' });

  const addCanvasEventListeners = (): void => {
    gameCanvas.addEventListener('wheel', (event) => {
      const deltaY = event.deltaY > 0 ? 1 : -1;
      worker.postMessage({
        topic: 'wheel',
        deltaY
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
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: - (event.clientY / window.innerHeight) * 2 + 1,
        },
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
  };

  worker.onmessage = ({ data }): void => {
    if (data.success) {
      addCanvasEventListeners();
    } else if (data.error) {
      showError(data.error);
    }
  };

  worker.postMessage({ topic: 'canvas', canvas: offscreen }, {
    transfer: [offscreen],
  });
} else {
  showError(error);
}
