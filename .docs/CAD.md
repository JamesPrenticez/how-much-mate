Key Takeaways from Figma/Excalidraw

1. Single Canvas: They use one canvas with layer compositing, not multiple canvases
2. Persistent WebGL Context: Never recreate WebGL surfaces/contexts
3. Temporal Coherence: During drags, they render temporary states without updating data structures
4. Aggressive Culling: Only render what's visible + small margin
5. Frame Rate Control: Cap at 60fps, skip frames when needed
6. Dirty Flagging: Only redraw changed regions
7. Event Coalescing: Batch multiple mouse events into single renders

The main issue is your current approach creates too much overhead per frame. The solutions above should give you smooth 60fps performance even with thousands of shapes.

# Performance
Before (Current Implementation)
During drag (per frame):
- Update shape in array
- Rebuild entire quadtree (~1000 shapes)
- Query quadtree for visible shapes
- Render all visible shapes
= ~5-10ms per frame with large datasets

After (Optimized Implementation)
During drag (per frame):
- Calculate preview position
- Composite cached background + preview
- Render selection overlay
= ~0.5-1ms per frame regardless of dataset size

Cache Warming: First render after zoom/pan will rebuild cache
Memory Usage: Background cache uses additional GPU memory (~canvas size)
Shape Changes: Any shape modification invalidates cache (as expected)
Drag Start: Brief cache rebuild to exclude dragged shape