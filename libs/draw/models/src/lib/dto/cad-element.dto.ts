import { CadElementProperties } from '../entities/cad-element.model';
import { GeometryType } from '../enums';
import { Geometry } from '../interfaces';

export interface CreateCadElementDto {
  projectId: string;
  subgroupId?: string;
  geometryType: GeometryType;
  layerName?: string;
  geometry: Geometry;
  properties?: CadElementProperties;
}