import { InteractionLayer } from './layers/interaction.layer'
import { CanvasLayer } from './layers/canvas.layer'
import { 
  drawSimpleRect1,
  drawSimpleRect2,
  drawSimpleRect3
} from './draw'
import { useShapesStore } from './stores';
import { drawGeometry } from './draw/draw-geometry';

export const EntryPoint = () => {
  const shapes = useShapesStore((s) => s.shapes);

  return (
      <InteractionLayer>

        <CanvasLayer
          id="grid-layer"
          draw={drawSimpleRect1}
          borderColor="fuchsia"
        />
        
        <CanvasLayer
          id="background-layer"
          draw={drawGeometry(shapes)}
          borderColor="cyan"
        />

        <CanvasLayer
          id="edit-layer"
          draw={drawSimpleRect3}
          borderColor="cyan"
        /> 

      </InteractionLayer>
  )
}