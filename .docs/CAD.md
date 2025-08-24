Key Takeaways from Figma/Excalidraw

1. Single Canvas: They use one canvas with layer compositing, not multiple canvases
2. Persistent WebGL Context: Never recreate WebGL surfaces/contexts
3. Temporal Coherence: During drags, they render temporary states without updating data structures
4. Aggressive Culling: Only render what's visible + small margin
5. Frame Rate Control: Cap at 60fps, skip frames when needed
6. Dirty Flagging: Only redraw changed regions
7. Event Coalescing: Batch multiple mouse events into single renders

The main issue is your current approach creates too much overhead per frame. The solutions above should give you smooth 60fps performance even with thousands of shapes.