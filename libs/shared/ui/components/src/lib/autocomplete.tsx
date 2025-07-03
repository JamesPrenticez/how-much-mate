import React, { useState, useEffect, useRef, type ReactNode } from 'react'
import styled from '@emotion/styled'



// Styled components
const Container = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;
  margin: 0.25rem 0;
  padding: 0.5rem 0;
  cursor: pointer;
  border-radius: 0.25rem;
  outline: none;
  /* ring: 1px solid blue; */
  ${({ isOpen }) => isOpen && `ring-color: blue;`}
`

const IconWrapper = styled.div`
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const Input = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0 12px;
  outline: none;
  background: transparent;
  color: var(--color-text);
  z-index: 50;

  &::placeholder {
    color: var(--color-secondary);
  }
`

const Caret = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Dropdown = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 2.5rem;
  left: 0;
  right: 0;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid blue;
  border-radius: 0.25rem;
  max-height: 20rem;
  overflow-y: auto;
  z-index: 50;
`

const OptionItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${({ active }) => (active ? 'blue' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : 'black')};

  &:hover {
    background-color: blue;
    color: white;
  }
`
interface AutoCompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  options: { label: string; value: string }[]
  onChange: (newValue: string) => void
  placeholder?: string
  renderIcon?: ReactNode
}

export const Autocomplete = ({
  value,
  options,
  onChange,
  placeholder,
  renderIcon,
  ...rest
}: AutoCompleteProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [filteredArray, setFilteredArray] = useState< { label: string; value: string }[]>(options)
  const [activeIndex, setActiveIndex] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const filteredOptions = options?.filter((item) => filteredArray?.includes(item))

  useEffect(() => {
    setFilteredArray(options)
  }, [options])

  const updateFilteredArray = (val: string) => {
    const filtered = options.filter((item) =>
      item.label.toLowerCase().includes(val.toLowerCase())
    )
    setFilteredArray(filtered)
  }

  const scrollIntoView = (direction: 'up' | 'down') => {
    let nextIndex = activeIndex
    if (direction === 'up') {
      nextIndex = activeIndex === 0 ? filteredArray.length - 1 : activeIndex - 1
    } else {
      nextIndex = activeIndex === filteredArray.length - 1 ? 0 : activeIndex + 1
    }
    itemsRef.current[nextIndex]?.scrollIntoView({ block: 'nearest' })
    setActiveIndex(nextIndex)
  }

  const handleArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        scrollIntoView('up')
        break
      case 'ArrowDown':
        e.preventDefault()
        scrollIntoView('down')
        break
      case 'Enter':
        e.preventDefault()
        if (filteredArray[activeIndex]) {
          onChange(filteredArray[activeIndex].value)
          setSearchValue('')
          setFilteredArray(options)
          setIsOpen(false)
          inputRef.current?.blur()
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchValue('')
        setFilteredArray(options)
        inputRef.current?.blur()
        break
    }
  }

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchValue(val)
    setActiveIndex(0)
    updateFilteredArray(val)
  }

  return (
    <Container isOpen={isOpen} ref={containerRef}>
      {renderIcon && <IconWrapper>{renderIcon}</IconWrapper>}

      <Input
        ref={inputRef}
        type='text'
        value={searchValue}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleArrowKeys}
        onChange={handleUpdate}
        placeholder={
          searchValue.length > 0
            ? ''
            : value.length > 0
            ? value
            : placeholder || 'Select...'
        }
        {...rest}
      />

      <Caret>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`${isOpen ? '-rotate-90' : 'rotate-0'} transition duration-200`}
          height={20}
          width={20}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
        </svg>
      </Caret>

      <Dropdown isOpen={isOpen}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item, index) => (
            <OptionItem
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              active={activeIndex === index}
              onMouseMove={() => setActiveIndex(index)}
              onMouseDown={() => {
                onChange(filteredArray[index].value)
                setSearchValue('')
                setFilteredArray(options)
                setIsOpen(false)
              }}
            >
              {item.label}
            </OptionItem>
          ))
        ) : (
          <OptionItem active={false}>No options found</OptionItem>
        )}
      </Dropdown>
    </Container>
  )
};
