import { Mesh } from 'three';
import { ColorPlane } from './colorPlane';
import { MaterialManager } from './materialManager';

export class Sprite extends Mesh {
  private texture: string;
  private index: number;
  constructor(texture: string, index = 0) {
    super(new ColorPlane(1, 1), MaterialManager.getMaterial(texture, index));

    this.texture = texture;
    this.index = index;
  }

  public setIndex(index: number): this {
    if (index !== this.index) {
      this.material = MaterialManager.getMaterial(this.texture, index);
      this.index = index;
    }

    return this;
  }

  public get currentIndex(): number {
    return this.index;
  }
}
