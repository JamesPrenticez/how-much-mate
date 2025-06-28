import clsx from 'clsx';
import styled from '@emotion/styled';
import { forwardRef } from 'react';

const InputContainer = styled.input`
  width: fit-content;

  color: var(--color-text);
  font-size: 3rem;
  line-height: 4.44rem;
  font-weight: 400;

  outline: none;
  border-radius: 0.8rem;
  border: var(--color-border) solid 0.2rem;
  box-sizing: border-box;
  
  padding: 0.5rem 1rem;
  margin: 0rem;
  
  transition: all 300ms ease;

  &.mobile {
    font-size: 2rem;
    line-height: 2rem;
  }

  &.default {
    color: var(--color-text);
    background-color: var(--color-background);
    /* border-color: var(--color-border); */

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }

    :focus-visible {
      border-color: var(--color-primary);
    }

    :disabled {
      color: var(--color-dark-grey-80);
      border-color: var(--color-grey-80);
      background-color: var(--color-grey-60);
    }
  }

  &.form {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    background-color: rgba(var(--color-secondary-opacity), 0.5);

    :hover {
      color: var(--color-white-100);
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }

  &.form {
    color: var(--color-text);
    background-color: rgba(var(--color-secondary-opacity), 0.2);
    border-color: var(--color-text);

    :focus {
      border-color: var(--color-accent);
    }
  }

    &.skeleton {
    color: var(--color-secondary);
    background-color: transparent;
    border: none;
    border-radius: 0rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0rem;
    margin: 0rem;

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }
  }

`;

export enum InputVariants {
  DEFAULT = 'default',
  OUTLINED = 'primary',
  FILLED = 'secondary',
  LINK = 'link',
  FORM = 'form',
  SKELETON = 'skeleton'
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariants;
  isMobile?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = InputVariants.DEFAULT, isMobile, ...rest }, ref) => {
    return (
      <InputContainer
        className={clsx(variant, {
          mobile: isMobile,
        })}
        ref={ref}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';
