export enum TIMBER {
  "90_X_45_H1.2_RAD" = "90 x 45 H1.2 Radiata Pine",
  "140_X_45_H1.2_RAD" = "140 x 45 H1.2 Radiata Pine"
}

export enum BRICK {
  "230_X_76_X_70_CLAY_BRICK" = "230 x 76 x 70 Clay Brick"
}

type Unit = "lm" | "m/m2" | "m2" | "m3"
type Dimensions = { width: number, thickness: number, length: number };

type TimberType = "H1.2" | "H3.2" | "H5";
type BrickType = "Clay" | "Stone";

export type IMaterial = {
  id: string; 
  title: TIMBER | BRICK; 
  cost: number;
  unit: Unit;
  dimensions: Dimensions
  type?: TimberType | BrickType;
};
