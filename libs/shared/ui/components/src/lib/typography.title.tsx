import type { HTMLAttributes } from 'react';
import styled from '@emotion/styled'

const Container = styled.h1`
  font-family: 'Orbitron', monospace;
  color: var(--color-white-80);
  font-size: 2.8rem;
  letter-spacing: 0.2rem;
`
interface TitleProps extends HTMLAttributes<HTMLHeadingElement>{};

export const Title = ({ children, ...props }: TitleProps) => {
  return (
    <Container {...props}>
      {children}
    </Container>
  );
};