export const initialConfig = {
  scale: 1,
  x: 0,
  y: 0,
  minZoom: 0.1,
  maxZoom: 8,
  zoomSpeed: 0.002,
  width: 800,
  height: 600,
}

// Quadtree
const viewportWidth = 1920;
const viewportHeight = 1080;

// world bounds = viewport * 4, centered at 0,0
export const WORLD_BOUNDS = {
  x: -(viewportWidth * 2),
  y: -(viewportHeight * 2),
  width: viewportWidth * 4,
  height: viewportHeight * 4,
};

export const BUCKET_SIZE = 8; // tweak for perf — 4–16 is a good range