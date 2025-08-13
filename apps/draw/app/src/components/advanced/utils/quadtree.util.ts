import { Shape } from "../models";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Quadtree {
  boundary: Rect;
  capacity: number;
  shapes: Shape[] = [];
  divided = false;
  northeast?: Quadtree;
  northwest?: Quadtree;
  southeast?: Quadtree;
  southwest?: Quadtree;

  constructor(boundary: Rect, capacity = 4) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  subdivide() {
    const { x, y, width, height } = this.boundary;
    const hw = width / 2;
    const hh = height / 2;

    this.northeast = new Quadtree({ x: x + hw, y, width: hw, height: hh }, this.capacity);
    this.northwest = new Quadtree({ x, y, width: hw, height: hh }, this.capacity);
    this.southeast = new Quadtree({ x: x + hw, y: y + hh, width: hw, height: hh }, this.capacity);
    this.southwest = new Quadtree({ x, y: y + hh, width: hw, height: hh }, this.capacity);

    this.divided = true;
  }

  insert(shape: Shape): boolean {
    if (!this.intersects(this.boundary, shape)) return false;

    if (this.shapes.length < this.capacity) {
      this.shapes.push(shape);
      return true;
    }

    if (!this.divided) this.subdivide();

    if (this.northeast!.insert(shape)) return true;
    if (this.northwest!.insert(shape)) return true;
    if (this.southeast!.insert(shape)) return true;
    if (this.southwest!.insert(shape)) return true;

    // Shouldn't reach here if shape fits in boundary
    return false;
  }

  query(range: Rect, found: Shape[] = []): Shape[] {
    if (!this.intersects(this.boundary, range)) return found;

    for (const shape of this.shapes) {
      if (this.intersects(shape, range)) {
        found.push(shape);
      }
    }

    if (this.divided) {
      this.northwest!.query(range, found);
      this.northeast!.query(range, found);
      this.southwest!.query(range, found);
      this.southeast!.query(range, found);
    }

    return found;
  }

  intersects(a: Rect, b: Rect): boolean {
    return !(
      b.x > a.x + a.width ||
      b.x + b.width < a.x ||
      b.y > a.y + a.height ||
      b.y + b.height < a.y
    );
  }
}