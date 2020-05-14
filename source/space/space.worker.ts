import { Space } from './space';

let space: Space;

const onCanvas = (ev: {canvas: OffscreenCanvas}): void => {
  if ('requestAnimationFrame' in self) {
    space = new Space({
      canvas: ev.canvas,
    });

    self.postMessage({
      success: true,
    });

    space.run();
  } else {
    self.postMessage({
      error: 'requestAnimationFrame is not supported on workers',
    });
  }
};

onmessage = (event): void => {
  const {topic, ...otherParams} = event.data;
  if (topic === 'canvas') {
    onCanvas(event.data);
  } else if (space) {
    space.dispatchEvent({
      type: topic,
      ...otherParams
    });
  }
};
