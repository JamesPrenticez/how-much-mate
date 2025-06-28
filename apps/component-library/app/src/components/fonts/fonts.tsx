import styled from '@emotion/styled'

const Container = styled.div`
    .default {
    font-family: 'sans-serif', sans-serif;
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 400;
  }

  .orbitron {
    font-family: 'Orbitron', sans-serif;
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 900;
  }

  .aux-mono {
    font-family: 'Aux Mono', sans-serif;
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 900;
  }

  .manuka {
    font-family: 'Manuka';
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 500;
  }

  .manuka-black {
    font-family: 'Manuka Black';
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 900;
  }

  .enduro {
    font-family: 'Enduro';
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 400;
  }

  .quicksand {
    font-family: 'Quicksand';
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 400;
  }

  .aronui {
    font-family: 'Aronui';
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 400;
  }
`

export const Fonts = () => {
  return (
    <Container>
        <h1 className='default'>Dice Magic</h1>
        <h1 className='orbitron'>Dice Magic</h1>
        <h1 className='aux-mono'>Dice Magic</h1>
        <h1 className='manuka'>Dice Magic</h1>
        <h1 className='manuka-black'>Dice Magic</h1>
        <h1 className='enduro'>Dice Magic</h1>
        <h1 className='quicksand'>Dice Magic</h1>
        <h1 className='aronui'>Dice Magic</h1>
    </Container>
  )
}