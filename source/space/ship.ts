// TODO: clean this up
import { Sprite } from './sprite';
import { Space } from './space';
import { Object3D, Vector3, MathUtils, Event } from 'three';

interface Params {
  sprite?: Sprite;
  speed?: number;
  space: Space;
}

export class Ship extends Object3D {
  constructor(params: Params) {
    super();

    this.position.set(MathUtils.randFloat(-2, 2), MathUtils.randFloat(-2, 2), MathUtils.randFloat(2, 4));
    this.rotation.z = MathUtils.randFloat(0, 2 * Math.PI);

    const sprite = params.sprite || new Sprite('ship', MathUtils.randInt(11, 15));

    this.userData = {
      speed: params.speed || MathUtils.randFloat(0.5, 2)
    };

    this.add(sprite);

    params.space.addEventListener('update', this.update.bind(this));
  }

  update(event: Event): void {
    const dirVector = new Vector3(-Math.sin(this.rotation.z), Math.cos(this.rotation.z), 0);
    dirVector.multiplyScalar(this.userData.speed * event.delta);

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
