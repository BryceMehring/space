import { Scene, PerspectiveCamera, WebGLRenderer, Raycaster, DirectionalLight, EventDispatcher, Event, Vector2, Vector3 } from 'three';
import { Planets } from './planets';
import { loadTextures } from './textures';
import { Ship } from './ship';
import { SpaceStations } from './spaceStations';
import { Mouse } from './mouse';
import { Sprite } from './sprite';

interface SpaceParams {
  canvas: OffscreenCanvas;
}

export class Space extends EventDispatcher {
  private canvas: OffscreenCanvas;
  private width: number;
  private height: number;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private mouse = new Mouse();
  private raycaster =  new Raycaster();
  private renderer: WebGLRenderer;

  private shipList: Ship[] = [];
  private spaceStations!: SpaceStations;
  private planets!: Planets;
  private dt = 0;
  private counter = 0;

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

    this.addEventListener('wheel', this.wheel.bind(this));
    this.addEventListener('resize', this.resize.bind(this));
    this.addEventListener('mousedown', this.mousedown.bind(this));
    this.addEventListener('mousedown', this.shipRaycastDestroy.bind(this));
    this.addEventListener('mouseup', this.mouseup.bind(this));
    this.addEventListener('mousemove', this.mousemove.bind(this));
  }

  public async run(): Promise<void> {
    await loadTextures();
    this.buildLights()
      .buildWorld();

    this.animate();
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
      const destroyListener = (): void => {
        this.scene.remove(ship);
        ship.removeEventListener('destroy', destroyListener);
      };
      ship.addEventListener('destroy', destroyListener);
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

  private shipRaycastDestroy(): void {
    this.raycaster.setFromCamera(this.mouse.pos, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    for (const intersectedObject of intersects) {
      const object = intersectedObject.object;
      if (object instanceof Sprite) {
        object.dispose();
      }
    }
  }

  private render(): void {
    if (!this.mouse.down && this.counter <= 1 && this.mouse.accel.length() > 0) {
      this.counter += this.dt / 60;
      this.mouse.accel.lerp(new Vector2(0.1, 0.1), this.counter);

      this.camera.position.addScaledVector(new Vector3(-this.mouse.accel.x, this.mouse.accel.y), this.dt);
    } else {
      this.counter = 0;
    }

    this.dispatchEvent({
      type: 'update',
      delta: this.dt,
    });

    this.renderer.render(this.scene, this.camera);
  }

  private mousedown(): void {
    this.mouse.down = true;
  }

  private mouseup(): void {
    this.mouse.down = false;
  }

  private mousemove(event: Event): void {
    if (this.mouse.down) {
      this.camera.position.x += -event.event.movementX * this.delta;
      this.camera.position.y += event.event.movementY * this.delta;
      this.mouse.accel.set(event.event.movementX, event.event.movementY);
    }
    this.mouse.pos.set(event.event.x, event.event.y);
  }

  private resize(event: Event): void {
    this.width = event.size.width;
    this.height = event.size.height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
  }

  private wheel(event: Event): void {
    this.camera.position.z += event.deltaY;
  }
}
