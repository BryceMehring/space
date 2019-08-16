import SpaceWorker from './space.worker';

const gameCanvas = document.getElementById('game');

const onWindowResize = () => {
  gameCanvas.setAttribute('width', window.innerWidth);
  gameCanvas.setAttribute('height', window.innerHeight);
}

onWindowResize(gameCanvas);

const offscreen = gameCanvas.transferControlToOffscreen();

const worker = new SpaceWorker();

worker.postMessage({topic: 'canvas', canvas: offscreen}, [offscreen]);

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
