import { Group, IGroup, EXTERIOR_WALLS } from "@draw/models"

export const groups: IGroup[] = [
  {
    id: "E7",
    title: Group.EXTERIOR_WALLS,
    elements: [
      EXTERIOR_WALLS.TIMBER_WALL_FRAMING,
      EXTERIOR_WALLS.CLADDING
    ]
  },
]
