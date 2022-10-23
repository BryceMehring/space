declare module 'three/examples/*';

interface HTMLCanvasElement {
  transferControlToOffscreen: () => any;
}

interface OffscreenCanvas {
  width: number;
  height: number;
  getContext: any;
}

