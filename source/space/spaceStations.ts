import { Group, Math as ThreeMath, Event } from 'three';
import { Sprite } from './sprite';
import { Space } from './space';

interface SpaceStationParam {
  count: number;
  space: Space;
}

export class SpaceStations extends Group {
  constructor({ count, space }: SpaceStationParam) {
    super();
    this.userData.intervals = [];

    for (let i = 0; i < count; ++i) {
      const spaceStation = new Sprite('space-station', ThreeMath.randInt(1, 3));
      const scale = ThreeMath.randFloat(2, 3);
      spaceStation.position.set(ThreeMath.randFloat(-8, 8), ThreeMath.randFloat(-8, 8), ThreeMath.randFloat(-10, 10));
      spaceStation.scale.set(scale, scale, 1);
      spaceStation.rotation.z = ThreeMath.randFloat(0, 3.14);
      const rotationSpeed = ThreeMath.randInt(0, 1) ? ThreeMath.randFloat(-1, 0.5) : ThreeMath.randFloat(0.5, 1);

      this.userData.intervals.push(setInterval(SpaceStations.updateIndex, 2000, spaceStation, 1, 3));

      space.addEventListener('update', () => {
        spaceStation.rotation.z += rotationSpeed * space.delta;
      });

      this.add(spaceStation);
    }

    space.addEventListener('update', this.update.bind(this));

    this.children[0].position.set(0, 0, 5);
  }

  public dispose(): void {
    for (const interval of this.userData.intervals) {
      clearInterval(interval);
    }
  }

  private update(event: Event): void {
    this.rotation.z += 0.1 * event.delta;
  }

  private static updateIndex(sprite: Sprite, min: number, max: number): void {
    let index = sprite.currentIndex + 1;
    if (index > max) {
      index = min;
    }
    sprite.setIndex(index);
  }
}
