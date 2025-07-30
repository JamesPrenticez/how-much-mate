import { seedElementSubgroups } from "./element-subgroup.seed";
import { seedElements } from "./element.seed";
import { seedMaterials } from "./materials.seed"

// Note: Order matters a lot

export const seedAll = () => {
  seedMaterials();
  seedElements();
  seedElementSubgroups();
}