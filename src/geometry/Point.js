// Re-export Point class and factory function from fabric-layers for backward compatibility
import { Point as CorePoint, point as createPoint } from 'fabric-layers';

// Extend the Point class to maintain any custom methods from the React version
export class Point extends CorePoint {
  copy(point) {
    this.x = point.x;
    this.y = point.y;
    return this;
  }

  getArray() {
    return [this.x, this.y];
  }
}

// Re-export the point factory function
export const point = (...params) => new Point(...params);
