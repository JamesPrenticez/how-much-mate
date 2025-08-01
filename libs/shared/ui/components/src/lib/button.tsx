import styled from '@emotion/styled';
import clsx from 'clsx';

const ButtonContainer = styled.button`
  width: fit-content;

  color: var(--color-text);
  font-size: 3rem;
  line-height: 4.44rem;
  font-weight: 400;

  border-radius: 0.8rem;
  border: var(--color-border) solid 0.2rem;
  box-sizing: border-box;

  padding: 0.5rem 1.5rem;
  margin: 0rem;

  cursor: pointer;

  &.mobile {
    font-size: 2rem;
    line-height: 2rem;
  }

  &.default {
    color: var(--color-text);
    background-color: var(--color-background);
    border-color: var(--color-border);

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }

    :disabled {
      color: var(--color-dark-grey-80);
      border-color: var(--color-grey-80);
      background-color: var(--color-grey-60);
    }
  }

  &.filled {
    background-color: red;
  }

  &.outlined {
    border-color: red;
  }

  &.link {
    background: none;
    color: purple;
    text-decoration: underline;
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
  }
`;

export enum ButtonVariants {
  DEFAULT = 'default',
  OUTLINED = 'primary',
  FILLED = 'secondary',
  LINK = 'link',
  FORM = 'form',
  SKELETON = 'skeleton'
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  isMobile?: boolean;
}

export const Button = ({
  variant = ButtonVariants.DEFAULT,
  children,
  onClick,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <ButtonContainer
      className={clsx(variant, className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </ButtonContainer>
  );
};
