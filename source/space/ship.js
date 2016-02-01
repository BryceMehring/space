// TODO: clean this up
import {Sprite} from './sprite.js';

export class Ship extends THREE.Object3D {
  constructor(params) {
    params = params || {};

    super();

    this.position.set(THREE.Math.randFloat(-2, 2), THREE.Math.randFloat(-2, 2), THREE.Math.randFloat(2, 4));
    this.rotation.z = THREE.Math.randFloat(0, 2 * Math.PI);

    this.userData = {
      sprite: params.sprite || new Sprite('ship', THREE.Math.randInt(11, 15)),
      speed: params.speed || THREE.Math.randFloat(0.008, 0.01)
    };

    this.add(this.userData.sprite);
  }

  update() {
    let dirVector = new THREE.Vector3(-Math.sin(this.rotation.z), Math.cos(this.rotation.z), 0);
    dirVector.multiplyScalar(this.userData.speed);

    this.position.add(dirVector);

    // TODO: do not hard code this position clamp
    if(this.position.x >= 20 || this.position.x <= -20) {
      this.position.x = -this.position.x;
    }

    if(this.position.y >= 20 || this.position.y <= -20) {
      this.position.y = -this.position.y;
    }
  }
}
