import { MaterialManager } from './materialManager';
import shipsTexture from '../assets/images/ships.png';
import spaceStationNormalTexture from '../assets/images/space-station-normal.png';
import spaceStationTexture from '../assets/images/space-station.png';
import volcanicTexture from '../assets/images/planets/volcanic.png';
import venusianTexture from '../assets/images/planets/venusian.png';
import martianTexture from '../assets/images/planets/martian.png';
import icyTexture from '../assets/images/planets/icy.png';

export const loadTextures = (): Promise<void[]> => {
  return Promise.all([
    MaterialManager.addTexture({
      key: 'ship',
      texture: shipsTexture,
      tilesHorizontal: 4,
      tilesVerticle: 4
    }),
    MaterialManager.addTexture({
      key: 'space-station',
      texture: spaceStationTexture,
      normal: spaceStationNormalTexture,
      tilesHorizontal: 2,
      tilesVerticle: 2,
      roughness: 0.4,
      metalness: 0.8,
    }),
    MaterialManager.addTexture({
      key: 'volcanic-planet',
      texture: volcanicTexture,
    }),
    MaterialManager.addTexture({
      key: 'venusian-planet',
      texture: venusianTexture,
    }),
    MaterialManager.addTexture({
      key: 'martian-planet',
      texture: martianTexture,
    }),
    MaterialManager.addTexture({
      key: 'icy-planet',
      texture: icyTexture,
    }),
  ]);
};

export const planets = Object.freeze([
  'volcanic-planet',
  'venusian-planet',
  'martian-planet',
  'icy-planet',
]);
