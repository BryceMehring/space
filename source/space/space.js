import { Scene, PerspectiveCamera, WebGLRenderer, Vector2, Raycaster, DirectionalLight } from 'three';
import { Planets } from './planets';
import { loadTextures } from './textures';
import { Ship } from './ship';
import { SpaceStations } from './spaceStations';

export class Space {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.shipList = [];
    this.axis = [];
  }

  async run() {
    this.configureThreeJS();
    await loadTextures();
    this.buildLights()
      .buildWorld();

    this.animate();
  }

  configureThreeJS() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(90, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 8;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.resize({
      width: this.width,
      height: this.height,
    });

    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
  }

  animate(previousTime) {
    requestAnimationFrame((time) => {
      previousTime = previousTime || time;
      const delta = (time - previousTime) / 1000;
      this.delta = delta;
      this.render(delta);
      this.animate(time);
    });
  }

  render(delta) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (this.intersected) {
      this.intersected.forEach(function (intersectedObject) {
        intersectedObject.object.geometry.setColor({ r: 1, g: 1, b: 1 });
      });
      this.intersected = null;
    }

    if (this.mouseDown) {
      if (intersects.length > 0) {
        intersects.forEach(function (intersectedObject) {
          intersectedObject.object.geometry.setColor({ r: 1, g: 0.2, b: 0.2 });
        });
        this.intersected = intersects;
      }
    }

    for (const ship of this.shipList) {
      ship.update(delta);
    }
    this.spaceStations.rotation.z += 0.1 * delta;

    this.renderer.render(this.scene, this.camera);
  }

  buildLights() {
    let directionalLight = new DirectionalLight(0x22ffff, 0.5);
    directionalLight.position.set(5, 1, 10);

    let directionalLight2 = new DirectionalLight(0xbbffff, 0.8);
    directionalLight2.position.set(1, 1, 15);

    //const helper = new DirectionalLightHelper(directionalLight);
    //const helper2 = new DirectionalLightHelper(directionalLight2);
    this.scene.add(directionalLight, directionalLight2, /*helper, helper2*/);

    return this;
  }

  buildWorld() {

    this.spaceStations = new SpaceStations({ count: 10, space: this });
    this.scene.add(this.spaceStations);

    this.planets = new Planets({count: 500, space: this});

    this.scene.add(this.planets);

    for (let i = 0; i < 50; ++i) {
      let ship = new Ship();
      this.scene.add(ship);
      this.shipList.push(ship);
    }

    return this;
  }

  resize({ width, height }) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  wheel({ deltaY }) {
    this.camera.position.z += deltaY;
  }
}
