import { Volume } from '@shared/models'

interface CalculatorResultsProps {
  dimensions: Volume | null;
  result: number | null;
}

export const CalculatorResults = ({ dimensions, result }: CalculatorResultsProps) => {
  return (
    <div>{result}</div>
  )
}