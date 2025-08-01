import z, { ZodLiteral } from 'zod';

export const ELEMENTS = {
  E7: {
    code: 'E7',
    name: 'exterior walls and exterior finishes',
    subgroups: {
      E701: { code: 'E701', name: 'timber wall framing' },
      E702: { code: 'E702', name: 'cladding' },
    },
  },
  E8: {
    code: 'E8',
    name: 'windows and exterior doors',
    subgroups: {
      E801: 'window framing',
      E802: 'window flashing',
    },
  },
} as const;

export type ElementCode = keyof typeof ELEMENTS;
export type ElementName = (typeof ELEMENTS)[ElementCode]['name'];
// export type AllElementNames = (typeof ELEMENTS)[keyof typeof ELEMENTS]['name'];

// Helper Function
export function literalUnionFromArray<T extends readonly string[]>(values: T) {
  const literals: ZodLiteral<T[number]>[] = values.map((value) =>
    z.literal(value)
  );

  if (literals.length === 1) {
    return literals[0];
  }

  return z.union(
    literals as [
      ZodLiteral<T[number]>,
      ZodLiteral<T[number]>,
      ...ZodLiteral<T[number]>[]
    ]
  );
}

const elementCodes = Object.keys(ELEMENTS) as [string, ...string[]];
const elementNames = Object.values(ELEMENTS).map((e) => e.name) as [
  string,
  ...string[]
];

export const elementCodeLiterals = literalUnionFromArray(elementCodes);
export const elementNameLiterals = literalUnionFromArray(elementNames);
