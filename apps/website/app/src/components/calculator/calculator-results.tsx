import { Volume } from '@shared/models'
import React from 'react'

interface CalculatorResultsProps {
  dimensions: Volume | null;
  result: number | null;
}

export const CalculatorResults = ({ dimensions, result }: CalculatorResultsProps) => {
  return (
    <div>{result}</div>
  )
}