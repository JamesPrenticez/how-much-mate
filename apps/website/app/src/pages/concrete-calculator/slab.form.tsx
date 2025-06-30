import styled from '@emotion/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, InputVariants } from '@shared/components';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { calculateVolume } from '@shared/utils';
import { SlabResults } from './slab.results';
import { Volume } from '@shared/models';

const Container = styled.div``;

const FormContainer = styled.div``;

const ErrorText = styled.p`
  color: red;
  font-size: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
`;

const schema = z.object({
  width: z.number().nonnegative('Must be non-negative'),
  height: z.number().nonnegative('Must be non-negative'),
  depth: z.number().nonnegative('Must be non-negative'),
});

type FormData = z.infer<typeof schema>;

export const SlabForm = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      width: 100,
      height: 100,
      depth: 100,
    },
  });

  const [result, setResult] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<Volume | null>(null);

  // Watch all fields
  const values = watch();

  useEffect(() => {
    if (
      typeof values.width === 'number' &&
      typeof values.height === 'number' &&
      typeof values.depth === 'number'
    ) {
      setResult(calculateVolume(values.width, values.height, values.depth));
      setDimensions({
        width: values.width,
        height: values.height,
        depth: values.depth,
      });
    }
  }, [values]);

  return (
    <Container>
      <FormContainer>
        <Controller
          name="width"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              variant={InputVariants.FORM}
              type="number"
              placeholder="Width"
            />
          )}
        />
        {errors.width && <ErrorText>{errors.width.message}</ErrorText>}

        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              variant={InputVariants.FORM}
              type="number"
              placeholder="Height"
            />
          )}
        />
        {errors.height && <ErrorText>{errors.height.message}</ErrorText>}

        <Controller
          name="depth"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              variant={InputVariants.FORM}
              type="number"
              placeholder="Depth"
            />
          )}
        />
        {errors.depth && <ErrorText>{errors.depth.message}</ErrorText>}
      </FormContainer>

      <SlabResults dimensions={dimensions} result={result} />
    </Container>
  );
};
