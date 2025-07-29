import { CadElementProperties } from '../entities/cad-element.model';
import { ElementType } from '../enums';
import { Geometry } from '../interfaces';

export interface CreateCadElementDto {
  projectId: string;
  subgroupId?: string;
  elementType: ElementType;
  layerName?: string;
  geometry: Geometry;
  properties?: CadElementProperties;
}