import { seedElements } from "./element.seed";
import { seedMaterials } from "./materials.seed"

export const seedAll = () => {
  seedMaterials();
  seedElements();
  
}