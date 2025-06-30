import { Volume } from '@shared/models'
import React from 'react'

interface SlabResultsProps {
  dimensions: Volume | null;
  result: number | null;
}

export const SlabResults = ({ dimensions, result }: SlabResultsProps) => {
  return (
    <div>{result}</div>
  )
}