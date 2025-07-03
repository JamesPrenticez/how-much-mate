import type { HTMLAttributes } from 'react';
import styled from '@emotion/styled'
import { device } from '@shared/hooks';

const Container = styled.h1`
  font-family: 'Aronui', monospace;
  color: var(--color-text);
  font-size: 3.6rem;
  font-weight: 900;
  letter-spacing: -0.1rem;

  @media ${device.tablet} {
    font-size: 2.4rem;
  }
`
type TitleProps = HTMLAttributes<HTMLHeadingElement>;

export const Title = ({ children, ...props }: TitleProps) => {
  return (
    <Container {...props}>
      {children}
    </Container>
  );
};