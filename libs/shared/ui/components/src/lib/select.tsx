import styled from '@emotion/styled';
import clsx from 'clsx';
// import Chevron from '@shared/assets/icons/chevron.icon.svg?react' // what a waste of time

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  width: fit-content;
  height: fit-content;
  
  .chevron {
    position: absolute;
    pointer-events: none;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3rem;
    height: 3rem;
  }
`;

const SelectContainer = styled.select`
  appearance: none;
  width: fit-content;

  color: var(--color-text);
  font-size: 3rem;
  line-height: 4.44rem;
  font-weight: 400;

  outline: none;
  border-radius: 0.8rem;
  border: var(--color-border) solid 0.2rem;
  box-sizing: border-box;

  padding: 0.5rem 3rem 0.5rem 1.5rem;
  margin: 0rem;

  transition: all 300ms ease;
  cursor: pointer;
  background-color: var(--color-background);


  &.mobile {
    font-size: 2rem;
    line-height: 2rem;
  }

  &.default {
    color: var(--color-text);
    background-color: var(--color-background);
    border-color: var(--color-border);

    :focus-visible {
      border: 0.2rem var(--color-primary) solid;
    }

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
    background-color: var(--color-primary);
    color: var(--color-white-100);
    border-color: var(--color-primary);

    :hover {
      background-color: var(--color-primary-80);
    }
  }

  &.outlined {
    border-color: var(--color-primary);
    background-color: transparent;

    :hover {
      background-color: rgba(var(--color-primary-opacity), 0.1);
    }
  }

  &.link {
    background: none;
    border: none;
    color: var(--color-primary);
    text-decoration: underline;
    padding: 0;
    line-height: inherit;
  }

  &.form {
    display: flex;
    align-items: center;
    justify-content: center;
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
    padding: 0;
    margin: 0;

    :hover {
      color: var(--color-primary);
    }
  }
`;

// const Chevron = styled.span`
//   position: absolute;
//   pointer-events: none;
//   right: 1rem;
//   top: 50%;
//   transform: translateY(-50%);
//   width: 1.5rem;
//   height: 1.5rem;
// `;

export enum SelectVariants {
  DEFAULT = 'default',
  OUTLINED = 'outlined',
  FILLED = 'filled',
  LINK = 'link',
  FORM = 'form',
  SKELETON = 'skeleton',
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariants;
  isMobile?: boolean;
}

export const Select = ({
  variant = SelectVariants.DEFAULT,
  children,
  isMobile,
  ...rest
}: SelectProps) => (
  <SelectWrapper>
    <SelectContainer
      className={clsx(variant, { mobile: isMobile })}
      {...rest}
    >
      {children}
    </SelectContainer>
       <svg 
         className='chevron'
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
       >
         <path d="m6 9 6 6 6-6"/>
       </svg>
  </SelectWrapper>
);



