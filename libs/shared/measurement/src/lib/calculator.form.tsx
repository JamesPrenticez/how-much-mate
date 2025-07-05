// import styled from '@emotion/styled';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input, InputVariants } from '@shared/components';
// import { useEffect, useMemo, useState } from 'react';
// import { Controller, useForm, useWatch } from 'react-hook-form';
// import { z } from 'zod';
// import { calculateVolume } from '@shared/utils';
// import { Volume } from '@shared/models';
// import { CalculatorResults } from './calculator-results';
// import { ImperialUnit, MetricUnit, type MeasurementData } from './measurement.types';
// import { System, useSystemStore } from './measurement-system.store';
// import { formatMeasurement, parseMeasurement } from './measurement-formatter.util';

// const Container = styled.div``;
// const FormContainer = styled.div``;
// // const ErrorText = styled.p`
// //   color: red;
// //   font-size: 1.2rem;
// //   line-height: 1.2rem;
// //   text-align: center;
// // `;

// interface CalculatorFormProps {
//   data: MeasurementData;
// }

// export const CalculatorForm = ({ data }: CalculatorFormProps) => {
//   const desiredSystem = useSystemStore(s => s.system)
//   const [desiredUnit, setDesiredUnit] = useState<MetricUnit | ImperialUnit>('mm');


//   // Dynamically build Zod schema and default values from calculatorData.inputs
//   const { schema, defaultValues } = useMemo(() => {
//     const shape: Record<string, z.ZodTypeAny> = {};
//     const defaults: Record<string, number | undefined> = {};

//     Object.entries(data.inputs).forEach(([key, input]) => {
//       shape[key] = z.number().nonnegative('Must be non-negative').optional();
//       defaults[key] = undefined; // Keep defaults as undefined
//     });

//     return {
//       schema: z.object(shape),
//       defaultValues: defaults,
//     };
//   }, [data]);

//   type FormData = z.infer<typeof schema>;

//   const {
//     control,
//     formState: { errors },
//     setValue,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues,
//   });

//   // Pre-populate the form with values from data.inputs
//   useEffect(() => {
//     Object.entries(data.inputs).forEach(([key, input]) => {
//       setValue(key as keyof FormData, input.value);
//     });
//   }, [data, setValue]);

//   const values = useWatch({ control });
//   const [result, setResult] = useState<number | null>(null);
//   const [dimensions, setDimensions] = useState<Volume | null>(null);

//   useEffect(
//     function autoCalcResult() {
//       console.log(values);
//       const nums = Object.values(values ?? {});
//       // Convert undefined to 0, keep numbers as-is
//       const [width, height, depth] = nums.map((value) =>
//         typeof value === 'number' ? value : 0
//       ) as number[];
//       setResult(calculateVolume(width, height, depth));
//       setDimensions({ width, height, depth });
//     },
//     [values]
//   );

//   return (
//     <Container>
//       <FormContainer>
//         {Object.entries(data.inputs).map(([name, input]) => (
//           <div key={name}>
//             <Controller
//               name={name as keyof FormData}
//               control={control}
//               render={({ field }) => {
//                 const valueInMm = field.value ?? 0;
//                 const formatted = formatMeasurement(valueInMm, desiredSystem, desiredUnit);

//                 return (
//                   <Input
//                     {...field}
//                     value={formatted}
//                     onChange={(e) => {
//                       const input = e.target.value;
//                       const parsed = parseMeasurement(input, desiredSystem, desiredUnit);
//                       console.log(parsed)
//                       field.onChange(isNaN(parsed) ? undefined : parsed); // always store mm
//                     }}
//                     variant={InputVariants.FORM}
//                     placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
//                   />
//                 );
//               }}
//             />

//             {/* {errors[name as keyof FormData] && (
//               <ErrorText>
//                 {errors[name as keyof FormData]?.message}
//                 </ErrorText>
//             )} */}
//           </div>
//         ))}
//       </FormContainer>

//       <CalculatorResults dimensions={dimensions} result={result} />
//     </Container>
//   );
// };

import React from 'react'

export const CalculatorForm = () => {
  return (
    <div>CalculatorForm</div>
  )
}