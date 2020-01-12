import { Space } from './space';

let space;

const onCanvas = (ev) => {
  if (self.requestAnimationFrame) {
    space = new Space({
      canvas: ev.canvas,
    });

    space.run();
  } else {
    postMessage({
      error: new Error('requestAnimationFrame is not supported'),
    });
  }
};

const onResize = (ev) => {
  space.resize(ev.size);
};

const onWheel = (event) => {
  space.wheel(event);
};

const messages = {
  canvas: onCanvas,
  resize: onResize,
  wheel: onWheel,
};

onmessage = function (ev) {
  messages[ev.data.topic](ev.data);
};
