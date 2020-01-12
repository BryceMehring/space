import { SphereBufferGeometry, InstancedMesh, Matrix4, Math as ThreeMath, Vector3, Quaternion, Object3D } from 'three';
import { MaterialManager } from './materialManager';
import { planets as planetTextures } from './textures';

export class Planets extends Object3D {
  constructor(params) {
    super();

    const axis = [];

    const q = new Quaternion();
    this.position.z = -300;
    for (let i = 0, l = planetTextures.length; i < l; i++) {
      const starsGeometry = new SphereBufferGeometry(1, 32, 32);
      const material = MaterialManager.getMaterial(planetTextures[i]);

      const mesh = new InstancedMesh(starsGeometry, material, params.count);

      let m = new Matrix4();

      for (let j = 0; j < params.count / l; j++) {
        const scale = ThreeMath.randFloat(5, 10);
        m.compose(
          new Vector3(ThreeMath.randFloatSpread(1500), ThreeMath.randFloatSpread(1500), ThreeMath.randFloat(-200, 200)),
          q,
          new Vector3(scale, scale, scale)
        );

        mesh.setMatrixAt(j, m);

        axis.push(
          new Vector3(ThreeMath.randFloat(-1, 1), ThreeMath.randFloat(-1, 1), ThreeMath.randFloat(-1, 1)).normalize()
        );
      }

      mesh.onBeforeRender = () => {
        for (let j = 0; j < params.count / l; j++) {
          mesh.getMatrixAt(j, m);

          const dummy = new Object3D();
          dummy.applyMatrix(m);
          dummy.rotateOnAxis(axis[j], 0.5 * params.space.delta);
          dummy.updateMatrix();

          mesh.setMatrixAt(j, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      };

      this.add(mesh);
    }
  }
}
