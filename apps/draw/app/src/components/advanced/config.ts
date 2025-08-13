export const initialConfig = {
  scale: 1,
  x: 0,
  y: 0,
  minZoom: 0.1,
  maxZoom: 8,
  width: 800,
  height: 600,
}

// Quadtree
export const WORLD_BOUNDS = {
  x: 0,
  y: 0,
  width: 5000,
  height: 5000
};

export const BUCKET_SIZE = 8; // tweak for perf — 4–16 is a good range