import React, { useState, useRef, useEffect, type ReactNode } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  position: relative;
  width: 100%; // space for caret

  cursor: pointer;
  user-select: none;
`

const Selected = styled.div<{ isOpen: boolean }>`
  font-size: 1.6rem;
  padding: 1rem;
  border: 0.1rem solid var(--color-border, #ccc);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  color: var(--color-text, #333);
  background: var(--color-background, #fff);
  position: relative;

  &:focus {
    outline: none;
    border-color: var(--color-primary, blue);
  }
`

const Caret = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text, #333);
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% - 0.1rem);
  left: 0;
  right: 0;
  background: var(--color-background, #fff);
  border: 0.1rem solid var(--color-border, #ccc);
  border-radius: 0 0 0.2rem 0.2rem;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`

const Option = styled.div<{ isActive: boolean }>`
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? 'var(--color-primary, #007bff)' : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : 'var(--color-text, #333)')};

  &:hover {
    background: var(--color-primary, #007bff);
    color: white;
  }
`

type OptionType = { label: string; value: string }

interface CustomSelectProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  renderIcon?: ReactNode
}

export const Select = ({ options, value, onChange, placeholder, renderIcon }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Find the currently selected option and highlight it
      const selectedIndex = options.findIndex(option => option.value === value)
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
  }, [isOpen, value, options])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only handle keyboard events when the container is focused
      if (!isOpen || !containerRef.current?.contains(document.activeElement)) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          onChange(options[highlightedIndex].value)
          setIsOpen(false)
          setHighlightedIndex(-1)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, options, onChange])

  const handleSelectedKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      }
    }
  }

  return (
    <Container ref={containerRef}>
      <Selected
        tabIndex={0}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleSelectedKeyDown}
        isOpen={isOpen}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="custom-select-listbox"
      >
        {renderIcon && <span style={{ marginRight: '0.5rem' }}>{renderIcon}</span>}
        {selectedOption ? selectedOption.label : placeholder || 'Select...'}
        <Caret>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={20}
            width={20}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d='M18 15l-6-6-6 6' />
          </svg>
        </Caret>
      </Selected>

      {isOpen && (
        <Dropdown role="listbox" id="custom-select-listbox" tabIndex={-1}>
          {options.map((option, i) => (
            <Option
              key={option.value}
              isActive={highlightedIndex === i}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
                setHighlightedIndex(-1)
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
              role="option"
              aria-selected={value === option.value}
              tabIndex={-1}
            >
              {option.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </Container>
  )
}