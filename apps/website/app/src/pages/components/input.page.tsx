import styled from "@emotion/styled"
import { Input, InputVariants, SubTitle, Title } from "@shared/components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .row {
    display: flex;
    gap: 2rem;
  }
`

export const InputPage = () => {
  return (
    <Container>
      <Title>Input</Title>
            <section>
              <SubTitle>Default Input</SubTitle>
              <div className="row">
              <Input 
                placeholder="Default Input"
              />
              </div>
            </section>

            <section>
              <SubTitle>Filled Input</SubTitle>
              <div className="row">
              <Input 
                variant={InputVariants.FILLED}
                placeholder="Filled Input"
              />
              </div>
            </section>

            <section>
              <SubTitle>Outlined Input</SubTitle>
              <div className="row">
              <Input 
                variant={InputVariants.OUTLINED}
                placeholder="Outlined Input"
              />
              </div>
            </section>

            <section>
              <SubTitle>Form Input</SubTitle>
              <div className="row">
              <Input 
                variant={InputVariants.FORM}
                placeholder="Form Input"
              />
              </div>
            </section>

            <section>
              <SubTitle>Skeleton Input</SubTitle>
              <div className="row">
              <Input 
                variant={InputVariants.SKELETON}
                placeholder="Skeleton Input"
              />
              </div>
            </section>
      
    </Container>
  )
}