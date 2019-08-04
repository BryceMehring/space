import * as THREE from 'three';

export class Random {
  static getRandAngle() {
    return THREE.Math.randFloat(0, 2*Math.PI);
  }
}
