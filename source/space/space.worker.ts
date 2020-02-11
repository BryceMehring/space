import { Space } from './space';

let space: Space;

const onCanvas = (ev: {canvas: OffscreenCanvas}): void => {
  if (self.requestAnimationFrame) {
    space = new Space({
      canvas: ev.canvas,
    });

    space.run();
  } else {
    (self as any).postMessage({
      error: new Error('requestAnimationFrame is not supported'),
    });
  }
};

onmessage = (event): void => {
  const {topic, ...otherParams} = event.data;
  if (topic === 'canvas') {
    onCanvas(event.data);
  } else {
    space.dispatchEvent({
      type: topic,
      ...otherParams
    });
  }
};
