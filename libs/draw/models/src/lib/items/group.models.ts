import { EXTERIOR_WALLS, FLOOR } from "./element.models";

export enum Group {
  FLOOR = "floor",
  INTERIOR_WALLS = "interior walls",
  EXTERIOR_WALLS = "exterior walls",
  WINDOWS_AND_EXTERIOR_DOORS = "windows and exterior doors",
  ROOF = "roof",
  INTERIOR_DOORS = "interior doors",
  OTHER = "other"
}

type GroupElementMap = {
  [Group.EXTERIOR_WALLS]: EXTERIOR_WALLS;
  [Group.FLOOR]: FLOOR;
};

export type IGroup<K extends keyof GroupElementMap = keyof GroupElementMap> = {
  id: string;
  title: K;
  elements: GroupElementMap[K][];
};