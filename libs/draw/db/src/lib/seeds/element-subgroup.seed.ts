import { ElementCode, ElementSubCode, ElementSubgroup, ElementSubgroupValidator } from "@draw/models";
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

// This is where things get a little tricky.. only when seeding.
// We dont know the elementGroupId before its created
// so we make a "pre-seed" copy and then match code with code to get the id

interface PreSeedElementSubgroup extends Omit<ElementSubgroup, 'id' | 'createdAt' | 'updatedAt' | 'elementGroupId'> {
  code: ElementCode;
}

export const SEED_ELEMENT_SUBGROUPS: PreSeedElementSubgroup[] = [
  {
    code: ElementCode.E7,
    subCode: ElementSubCode.E701,
    name: 'Timber Wall Framing',
  },
  {
    code: ElementCode.E8,
    name: 'Double Glazed Alumnium Joinery',
    subCode: ElementSubCode.E801,
  },
];

export const seedElementSubgroups = async () => {
  const elementGroups = await db.elementGroups.toArray();

  const codeToIdMap = Object.fromEntries(
    elementGroups.map((group) => [group.code, group.id])
  );

  const subgroups: ElementSubgroup[] = SEED_ELEMENT_SUBGROUPS.map(({ code, ...rest }) => {
    const elementGroupId = codeToIdMap[code];
    if (!elementGroupId) {
      throw new Error(`No ElementGroup found for code ${code}`);
    }

    const completeSub: ElementSubgroup = {
      ...rest,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elementGroupId,
    };

    const errors = ElementSubgroupValidator.validate(completeSub);
    if (errors.length) {
      throw new Error(
        `Validation failed for subgroup ${rest.subCode}: ${errors.join(', ')}`
      );
    }

    return completeSub;
  });

  await db.elementSubgroups.bulkAdd(subgroups);
};