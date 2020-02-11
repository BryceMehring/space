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
