import styled from '@emotion/styled'
import { Button, ButtonVariants, ICONS } from '@shared/components'
import React from 'react'

const Container = styled.div`
  
`

export const MobileMenu = () => {
  return (
    <Container>
      <Button 
        variant={ButtonVariants.SKELETON}
      >
        {ICONS.Hamburger}
      </Button>
    </Container>
  )
}