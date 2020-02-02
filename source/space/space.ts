import { Scene, PerspectiveCamera, WebGLRenderer, Vector2, Raycaster, DirectionalLight, EventDispatcher, Event } from 'three';
import { Planets } from './planets';
import { loadTextures } from './textures';
import { Ship } from './ship';
import { SpaceStations } from './spaceStations';

interface SpaceParams {
  canvas: OffscreenCanvas;
}

export class Space extends EventDispatcher {
  private canvas: OffscreenCanvas;
  private width: number;
  private height: number;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private mouse = new Vector2();
  private raycaster =  new Raycaster();
  private renderer: WebGLRenderer;

  private shipList: Ship[] = [];
  private spaceStations!: SpaceStations;
  private planets!: Planets;
  private dt = 0;

  constructor({ canvas }: SpaceParams) {
    super();
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.camera = new PerspectiveCamera(90, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 8;

    const context = this.canvas.getContext( 'webgl2', { alpha: false, } );

    if (!context) {
      throw new Error('Cannot create webgl2 context');
    }

    this.renderer = new WebGLRenderer({
      context: context,
      canvas: this.canvas,
      antialias: true,
    });

    this.resize({
      type: 'resize',
      size: {
        width: this.width,
        height: this.height,
      }
    });

    this.addEventListener('wheel', this.wheel);
    this.addEventListener('resize', this.resize);
  }

  public async run(): Promise<void> {
    await loadTextures();
    this.buildLights()
      .buildWorld();

    this.animate();
  }

  public resize(event: Event): void {
    this.width = event.size.width;
    this.height = event.size.height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
  }

  public wheel(event: Event): void {
    this.camera.position.z += event.deltaY;
  }

  get delta(): number {
    return this.dt;
  }

  private buildLights(): this {
    const directionalLight = new DirectionalLight(0x22ffff, 0.5);
    directionalLight.position.set(5, 1, 10);

    const directionalLight2 = new DirectionalLight(0xbbffff, 0.8);
    directionalLight2.position.set(1, 1, 15);

    //const helper = new DirectionalLightHelper(directionalLight);
    //const helper2 = new DirectionalLightHelper(directionalLight2);
    this.scene.add(directionalLight, directionalLight2, /*helper, helper2*/);

    return this;
  }

  private buildWorld(): this {
    this.spaceStations = new SpaceStations({ count: 10, space: this });
    this.scene.add(this.spaceStations);

    this.planets = new Planets({count: 500, space: this});

    this.scene.add(this.planets);

    for (let i = 0; i < 50; ++i) {
      const ship = new Ship({space: this});
      this.scene.add(ship);
      this.shipList.push(ship);
    }

    return this;
  }

  private animate(previousTime?: number): void {
    requestAnimationFrame((time: number) => {
      previousTime = previousTime ?? time;
      const delta = (time - previousTime) / 1000;
      this.dt = delta;
      this.render();
      this.animate(time);
    });
  }

  private render(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    /*const intersects = this.raycaster.intersectObjects(this.scene.children, true);

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
    }*/

    this.dispatchEvent({
      type: 'update',
      delta: this.dt,
    });

    this.renderer.render(this.scene, this.camera);
  }
}
