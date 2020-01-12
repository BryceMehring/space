// TODO: clean this up
import {Sprite} from './sprite';
import { Object3D, Vector3, Math as ThreeMath } from 'three';

export class Ship extends Object3D {
  constructor(params) {
    params = params || {};

    super();

    this.position.set(ThreeMath.randFloat(-2, 2), ThreeMath.randFloat(-2, 2), ThreeMath.randFloat(2, 4));
    this.rotation.z = ThreeMath.randFloat(0, 2 * Math.PI);

    const sprite = params.sprite || new Sprite('ship', ThreeMath.randInt(11, 15));

    this.userData = {
      speed: params.speed || ThreeMath.randFloat(0.5, 2)
    };

    this.add(sprite);
  }

  update(delta) {
    let dirVector = new Vector3(-Math.sin(this.rotation.z), Math.cos(this.rotation.z), 0);
    dirVector.multiplyScalar(this.userData.speed * delta);

    this.position.add(dirVector);

    // TODO: do not hard code this position clamp
    if(this.position.x > 20 || this.position.x < -20) {
      this.position.x = 20 * (this.position.x > 0 ? -1 : 1);
    }

    if(this.position.y > 20 || this.position.y < -20) {
      this.position.y = 20 * (this.position.y > 0 ? -1 : 1);
    }
  }
}
