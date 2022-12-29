import { Space } from './space';

let space: Space;

const onCanvas = (ev: {canvas: OffscreenCanvas}): void => {
  space = new Space({
    canvas: ev.canvas,
  });

  self.postMessage({
    success: true,
  });

  space
    .run()
    .catch((e) => console.error(e));
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
