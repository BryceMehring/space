declare module '*.png'

declare interface SpaceResizeEvent {
  size: {
    width: number;
    height: number;
  };
}

declare interface SpaceWheelEvent {
  deltaY: number;
}

declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
