import { BRICK, IMaterial, TIMBER } from "./material.models"

export enum EXTERIOR_WALLS {
  CONCRETE_WALLS = "concrete walls",
  PARAPETS = "parapets",
  PRE_CAST_PANELS = "pre-cast panels",
  PRE_CAST_PARAPETS = "pre-cast parapets",
  TIMBER_WALL_FRAMING = "timber wall framing",
  BRICK_WALLS = "brick walls",
  CONCRETE_MASONRY_WALLS = "concrete masonry walls",
  METAL_WALL_FRAMING = "metal wall framing",
  CLADDING = "cladding",
  GIRTS = "girts",
  NIBS_KERBS_UPSTANDS = "nibs, kerbs and upstands"
}

export enum FLOOR {
  CONCRETE_SLAB = "concrete slab"
}

type UOM = "m/m2"

interface BuildUp {
  quantity: number;
  uom: UOM;
  material: TIMBER | BRICK;
}

export type IElement = {
  id: string; 
  title: EXTERIOR_WALLS | FLOOR; 
  buildUp: BuildUp[];
};