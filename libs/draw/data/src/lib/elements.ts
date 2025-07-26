import { EXTERIOR_WALLS, IElement, TIMBER } from "@draw/models";

export const Elements: IElement[] = [
  {
    id: "E7.05",
    title: EXTERIOR_WALLS.TIMBER_WALL_FRAMING,
    buildUp: [
      {
        quantity: 5000,
        uom: "m/m2",
        material: TIMBER["90_X_45_H1.2_RAD"]
      }
    ]
  }
]