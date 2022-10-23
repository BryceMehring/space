import { PlaneGeometry, BufferAttribute } from 'three';

interface Color {
  r: number;
  g: number;
  b: number;
}

export class ColorPlane extends PlaneGeometry {
  private bufferCount: number;
  constructor(width: number, height: number) {
    super(width, height);

    this.bufferCount = this.getAttribute('position').count;

    const colorBuffer = new Float32Array(3*this.bufferCount);
    colorBuffer.fill(1);

    this.setAttribute('color', new BufferAttribute(colorBuffer, 3));
  }

  setColor(color: Color): void {
    const colorAttribute = this.getAttribute('color') as BufferAttribute;
    for(let i = 0; i < this.bufferCount; ++i) {
      this.setColorAttribute(colorAttribute, i, color);
    }
    colorAttribute.needsUpdate = true;
  }

  setVertexColor(index: number, color: Color): void {
    const colorAttribute = this.getAttribute('color') as BufferAttribute;
    this.setColorAttribute(colorAttribute, index, color);

    colorAttribute.needsUpdate = true;
  }

  setColorAttribute(colorAttribute: BufferAttribute, index: number, color: Color): void {
    colorAttribute.setXYZ(index, color.r, color.g, color.b);
  }
}
