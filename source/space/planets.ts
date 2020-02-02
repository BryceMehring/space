import { SphereBufferGeometry, InstancedMesh, Matrix4, Math as ThreeMath, Vector3, Quaternion, Group, Object3D } from 'three';
import { MaterialManager } from './materialManager';
import { planets as planetTextures } from './textures';
import { Space } from './space';

interface PlanetParams {
  count: number;
  space: Space;
}

export class Planets extends Group {
  constructor(params: PlanetParams) {
    super();

    const q = new Quaternion();
    this.position.z = -300;
    for (let i = 0, l = planetTextures.length; i < l; i++) {
      const starsGeometry = new SphereBufferGeometry(1, 32, 32);
      const material = MaterialManager.getMaterial(planetTextures[i]);

      const mesh = new InstancedMesh(starsGeometry, material, params.count);

      const length = params.count / l;

      const matrixList: Matrix4[] = [];
      const axis: Vector3[] = [];

      for (let j = 0; j < length; j++) {
        const scale = ThreeMath.randFloat(5, 10);
        const m = new Matrix4();
        m.compose(
          new Vector3(ThreeMath.randFloatSpread(1500), ThreeMath.randFloatSpread(1500), ThreeMath.randFloat(-200, 200)),
          q,
          new Vector3(scale, scale, scale)
        );

        mesh.setMatrixAt(j, m);

        axis.push(
          new Vector3(ThreeMath.randFloat(-1, 1), ThreeMath.randFloat(-1, 1), ThreeMath.randFloat(-1, 1)).normalize()
        );

        matrixList.push(m);
      }

      params.space.addEventListener('update', (event) => {
        for (let j = 0; j < length; j++) {
          const dummy = new Object3D();
          dummy.applyMatrix(matrixList[j]);
          dummy.rotateOnAxis(axis[j], 0.5 * event.delta);
          dummy.updateMatrix();

          matrixList[j] = dummy.matrix;

          mesh.setMatrixAt(j, matrixList[j]);
        }
        mesh.instanceMatrix.needsUpdate = true;
      });

      this.add(mesh);
    }
  }
}
