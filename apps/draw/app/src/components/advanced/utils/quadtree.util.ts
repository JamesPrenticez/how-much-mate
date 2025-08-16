import { Shape } from "../models";

// 1. World Bounds aka boundry
// What it is:
// The root quadtree node’s width & height — the space your entire document fits in.

// Why it matters:
// If the world bounds are way bigger than your actual shapes, the tree will waste levels splitting huge empty space.
// If too small, shapes outside bounds won’t be stored unless you dynamically expand.

// Tuning options:

// Static World Bounds — If your canvas/doc is fixed-size (e.g., 5000×5000 world units), just set that once.

// Dynamic Bounds — Expand or rebuild the quadtree when shapes go outside the current bounds.

// Example:
// If your drawing area can scroll infinitely, start with a reasonable bounds (e.g., viewport × 4), and rebuild quadtree if a shape falls outside.

// 1. Bucket Size (a.k.a. Capacity per Node) aka capacity
// What it is:
// The maximum number of shapes a single quadtree node can hold before it splits into 4 children.

// Trade-offs:

// Bucket Size	Pros	Cons
// Small (e.g. 1–4)	Very fine-grained, fewer shapes per query	Deep tree → more recursion overhead
// Large (e.g. 20–50)	Shallow tree, less recursion	More shapes per query, slower lookups in dense areas


// But we go a step further here with auto-expansion
// this allows us to infinatly add shapes but make sure the quad tree grows to the correct size

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

  // Expand root to include out-of-bounds shape
  static ensureContains(root: Quadtree, shape: Shape): Quadtree {
    let { x, y, width, height } = root.boundary;

    // already fits
    if (root.intersects(root.boundary, shape)) return root;

    // Expand until the shape fits
    while (!root.intersects(root.boundary, shape)) {
      const expandLeft = shape.x < x;
      const expandUp = shape.y < y;

      const newWidth = width * 2;
      const newHeight = height * 2;

      // Shift origin if expanding left/up
      x = expandLeft ? x - width : x;
      y = expandUp ? y - height : y;

      const newBoundary: Rect = { x, y, width: newWidth, height: newHeight };
      const newRoot = new Quadtree(newBoundary, root.capacity);
      newRoot.insertNode(root); // reinsert old tree into new root
      root = newRoot;

      width = newWidth;
      height = newHeight;
    }

    return root;
  }

  // helper: reinsert entire old tree into new one
  private insertNode(node: Quadtree) {
    node.shapes.forEach(s => this.insert(s));
    if (node.divided) {
      node.northwest && this.insertNode(node.northwest);
      node.northeast && this.insertNode(node.northeast);
      node.southwest && this.insertNode(node.southwest);
      node.southeast && this.insertNode(node.southeast);
    }
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