import * as THREE from 'three';
import ships from '../assets/images/ships.png';
import spaceStationNormal from '../assets/images/space-station-normal.png';
import spaceStation from '../assets/images/space-station.png';
import { Random } from '../utils/random';
import { MaterialManager } from './materialManager';
import { Ship } from './ship';
import { Sprite } from './sprite';

export class Space {
  constructor({canvas}) {
    this.canvas = canvas;
    this.shipList = [];
  }

  async run() {
    this.configureThreeJS();
    await this.loadTextures();
    this.buildLights()
      .buildWorld();

    function updateIndex(sprite, min, max) {
    	let index = sprite.index + 1;
    	if(index > max) {
    		index = min;
    	}
    	sprite.setIndex(index);
    }

    this.spaceStationGroup.children.forEach(function(station) {
      setInterval(updateIndex, 2000, station, 1, 3);
    });

    this.animate();
  }

  configureThreeJS() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 90, this.width/this.height, 0.1, 1000 );
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.resize({
      width: this.width,
      height: this.height,
    });

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
  }

  animate(previousTime) {
    requestAnimationFrame((time) => {
      previousTime = previousTime || time;
      const delta = (time - previousTime) / 1000;
      this.render(delta);
      this.animate(time);
    });
  }

  render(delta) {
    this.raycaster.setFromCamera( this.mouse, this.camera );
    let intersects = this.raycaster.intersectObjects( this.scene.children, true);

    if(this.intersected) {
      this.intersected.forEach(function(intersectedObject) {
        intersectedObject.object.geometry.setColor({r: 1, g: 1, b: 1});
      });
      this.intersected = null;
    }

    if(this.mouseDown) {
      if(intersects.length > 0) {
        intersects.forEach(function(intersectedObject) {
          intersectedObject.object.geometry.setColor({r: 1, g: 0.2, b: 0.2});
        });
        this.intersected = intersects;
      }
    }

    this.spaceStationGroup.rotation.z += 0.1 * delta;
    for (const spaceStation of this.spaceStationGroup.children) {
      spaceStation.rotation.z += spaceStation.userData.rotationSpeed * delta;
    }

    for (const ship of this.shipList) {
      ship.update(delta);
    }

    this.renderer.render( this.scene, this.camera );
  }

  loadTextures() {
    return Promise.all([
      MaterialManager.addTexture({
        key: 'ship',
        texture: ships,
        tilesHorizontal: 4,
        tilesVerticle: 4
      }),
      MaterialManager.addTexture({
        key: 'space-station',
        texture: spaceStation,
        normal: spaceStationNormal,
        tilesHorizontal: 2,
        tilesVerticle: 2,
        specular: 0x55555555,
        shininess: 40
      }),
    ]);
  }

  buildLights() {
    let directionalLight = new THREE.DirectionalLight( 0xbbffff, 0.4 );
    directionalLight.position.set( 1, 1, 2 );
    this.scene.add( directionalLight );

    return this;
  }

  buildWorld() {
    this.spaceStationGroup = new THREE.Object3D();
    this.scene.add(this.spaceStationGroup);

    for(let i = 0; i < 3; ++i) {
      let spaceStation = new Sprite('space-station', THREE.Math.randInt(1, 3));
      let scale = THREE.Math.randFloat(2, 3);
      spaceStation.position.set(THREE.Math.randFloat(-8, 8), THREE.Math.randFloat(-8, 8), THREE.Math.randFloat(2, 4));
      spaceStation.scale.set(scale, scale, 1);
      spaceStation.rotation.z = Random.getRandAngle();
      spaceStation.userData.rotationSpeed = THREE.Math.randInt(0, 1) ? THREE.Math.randFloat(-1, 0.5) : THREE.Math.randFloat(0.5, 1)
      this.spaceStationGroup.add(spaceStation);
    }

    this.spaceStationGroup.children[0].position.set(0, 0, 5);

    for(let i = 0; i < 250; ++i) {
    	let ship = new Ship();
    	this.scene.add(ship);
    	this.shipList.push(ship);
    }

    return this;
  }

  resize({width, height}) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  wheel({deltaY}) {
    this.camera.position.z += deltaY;
  }
}
