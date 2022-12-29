import { Mesh, Object3D, PlaneGeometry } from 'three';
import { MaterialManager } from './materialManager';

export class Sprite extends Mesh {
  parent: Object3D & {
    dispose?: (obj: Object3D) => void;
  } = this.parent;

  private texture: string;
  private index: number;
  constructor(texture: string, index = 0) {
    super(new PlaneGeometry(1, 1), MaterialManager.getMaterial(texture, index));

    this.texture = texture;
    this.index = index;
  }

  /**
   * dispose
   */
  public dispose(): void {
    if (this.parent.dispose) {
      this.parent.dispose(this);
    }
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
