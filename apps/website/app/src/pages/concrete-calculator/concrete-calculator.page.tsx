import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { KeyLabel } from '@shared/models'
import styled from '@emotion/styled';

import {
  Button,
  ButtonVariants,
  Input,
  InputVariants,
  Tabs,
} from '@shared/components';

export enum TabKeys {
  SLAB = 'slab',
  POST = 'post',
  BLOCK = 'block',
}

const items: KeyLabel[] = [
  { key: TabKeys.SLAB, label: 'Slab' },
  { key: TabKeys.POST, label: 'Posts' },
  { key: TabKeys.BLOCK, label: 'Block Fill' },
];

const Container = styled.div``;

const ErrorText = styled.p`
  color: red;
  font-size: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
`;

// Zod validation schema for form
const schema = z.object({
  displayName: z.string().nonempty('Name is required'),
});

type FormData = z.infer<typeof schema>;

export const ConcreteCalculatorPage = () => {


  const [selectedTabItem, setSelectedTabItem] = useState(items[0].key);

let render = (() => {
  switch (selectedTabItem) {
    case TabKeys.SLAB:
      return <>Slab content here</>;
    case TabKeys.POST:
      return <>Posts content here</>;
    case TabKeys.BLOCK:
      return <>Block Fill content here</>;
    default:
      return null;
  }
})();

  return (
    <Container>
      <h1>Concrete Volume Calculator</h1>

      <Tabs
        items={items}
        selectedKey={selectedTabItem}
        onChange={(key) => setSelectedTabItem(key)}
      />

      {render}
      
        {/* const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  // const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  
  
    const handleUpdateUser = async (data: FormData) => {
    setUser({ id: 'asdf', username: data.displayName });
  };
  */}

      {/* <FormContainer>
        <form onSubmit={handleSubmit(handleUpdateUser)}>

          <Controller
            name="displayName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                variant={InputVariants.FORM}
                type="text"
                placeholder="Name"
                {...field}
              />
            )}
          />
          {errors.displayName && (
            <ErrorText>{errors.displayName.message}</ErrorText>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant={ButtonVariants.FORM}
          >
            {isLoading ? 'Loading...' : 'CONFIRM'}
          </Button>

          {isError && <ErrorText>{errorMessage}</ErrorText>}
        </form>
      </FormContainer> */}
    </Container>
  );
};
