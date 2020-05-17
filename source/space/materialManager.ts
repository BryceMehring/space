import { CanvasTexture, MeshStandardMaterial, Material, ImageBitmapLoader, RepeatWrapping, MeshStandardMaterialParameters, Cache } from 'three';

interface AddTextureParams {
  key: string;
  texture: string;
  color?: number;
  tilesHorizontal?: number;
  tilesVerticle?: number;

  normal?: string;
  roughness?: number;
  metalness?: number;
}

Cache.enabled = true;

export class MaterialManager {
  /* params = {
		key: unique value which identifies the texture + material
		texture: texture name,
		normal: normal map texture (optional),
		tilesHorizontal: number tiles horizontal (optional),
		tilesVerticle: number tiles vertile (optional),
		specular: Specular color of the material, i.e., how shiny the material is and the color of its shine. (optional),
		shininess: How shiny the specular highlight is; a higher value gives a sharper highlight. (optional),
		color: Diffuse color of the material. (optional)
  }*/
  private static cache = new Map<string, Material[]>();
  static textureLoader = new ImageBitmapLoader()
    .setOptions({
      imageOrientation: 'flipY',
      premultiplyAlpha: 'premultiply',
    });

  public static loadTexture(texture: string): Promise<CanvasTexture> {
    return new Promise<CanvasTexture>((resolve, reject) => {
      MaterialManager.textureLoader.load(texture, (imageBitmap) => {
        const canvasTexture = new CanvasTexture(imageBitmap as any); // TODO: fix cast to any
        resolve(canvasTexture);
      }, undefined, reject);
    });
  }

  public static async addTexture(params: AddTextureParams): Promise<void> {
    params.tilesHorizontal = params.tilesHorizontal || 1;
    params.tilesVerticle = params.tilesVerticle || 1;

    const repeatHorizontal = 1 / params.tilesHorizontal;
    const repeatVertical = 1 / params.tilesVerticle;

    for (let i = 0; i < params.tilesVerticle; ++i) {
      for (let j = 0; j < params.tilesHorizontal; ++j) {
        const index = i * params.tilesHorizontal + j;
        const offsetX = j / params.tilesHorizontal;
        const offsetY = i / params.tilesVerticle;
        const textureMap = await MaterialManager.loadTexture(params.texture);

        const materialArgs: MeshStandardMaterialParameters = {
          map: textureMap,
          transparent: true,
          alphaTest: 0.01,
          color: params.color || 0xffffffff,
        };

        let normalMap: CanvasTexture | undefined = undefined;

        if (params.normal) {
          normalMap = await MaterialManager.loadTexture(params.normal);

          materialArgs.roughness = params.roughness;
          materialArgs.metalness = params.metalness;
          materialArgs.normalMap = normalMap;
        }

        const material = new MeshStandardMaterial(materialArgs);

        for (const texture of [textureMap, normalMap]) {
          if (texture) {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(repeatHorizontal, repeatVertical);
            texture.offset.set(offsetX, offsetY);
          }
        }

        const cacheArray = MaterialManager.cache.get(params.key) ?? [];

        if (!cacheArray.length) {
          MaterialManager.cache.set(params.key, cacheArray);
        }

        cacheArray[index] = material;
      }
    }
  }

  static getMaterial(key: string, index = 0): Material {
    const value = MaterialManager.cache.get(key);
    if (!value || index >= value.length) {
      throw new Error(`Cannot find ${key} at ${index}`);
    }
    return value[index];
  }
}

