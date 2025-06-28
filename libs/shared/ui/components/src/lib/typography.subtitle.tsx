import type { HTMLAttributes } from 'react';
import styled from '@emotion/styled'

const Container = styled.h1`
  font-family: 'Orbitron', monospace;
  color: var(--color-white-40);
  font-size: 1.8rem;
  letter-spacing: 0.2rem;
`
interface SubTitleProps extends HTMLAttributes<HTMLHeadingElement>{};

export const SubTitle = ({ children, ...props }: SubTitleProps) => {
  return (
    <Container {...props}>
      {children}
    </Container>
  );
};