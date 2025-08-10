import { InteractionLayer } from './layers/interaction.layer'
import { CanvasLayer } from './layers/canvas.layer'
import { drawSimpleRect } from './draw'
import { drawSimpleRect2 } from './draw/simple-rect-2'

export const EntryPoint = () => {
  return (
      <InteractionLayer>

        <CanvasLayer
          draw={drawSimpleRect}
          borderColor="fuchsia"
        />
        <CanvasLayer
          draw={drawSimpleRect2}
          borderColor="cyan"
        /> 

      </InteractionLayer>
  )
}