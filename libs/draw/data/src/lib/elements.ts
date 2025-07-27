import { EXTERIOR_WALLS, IElement, TIMBER } from "@draw/models";

export const Elements: IElement[] = [
  {
    id: "E7.05",
    title: EXTERIOR_WALLS.TIMBER_WALL_FRAMING,
    buildUp: [
          {
            id: "010",
            name: "90 x 45 Timber",
            cost: 6,
            quantity: "5",
            unit: "m/m2",
          },
          {
            id: "0324",
            name: "R3.2 Pink Battas",
            cost: 3,
            quantity: "1",
            unit: "m2/m2",
          },

        ]
      }
    ]
  }
]