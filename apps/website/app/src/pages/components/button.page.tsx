import styled from "@emotion/styled"
import { Button, ButtonVariants, SubTitle, Title } from "@shared/components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .row {
    display: flex;
    gap: 2rem;
  }
`

export const ButtonPage = () => {
  return (
    <Container>
      <Title>Button</Title>

      <section>
        <SubTitle>Default Button</SubTitle>
        <div className="row">
          <Button>
            Default Button
          </Button>

          <Button disabled={true}>
            Default Button Disabled
          </Button>
        </div>
      </section>

      <section>
        <SubTitle>Filled Button</SubTitle>
        <div className="row">
          <Button variant={ButtonVariants.FILLED}>
            Default Button
          </Button>

          <Button variant={ButtonVariants.FILLED} disabled={true}>
            Default Button Disabled
          </Button>
        </div>
      </section>

      <section>
        <SubTitle>Outlined Button</SubTitle>
        <div className="row">
          <Button variant={ButtonVariants.OUTLINED}>
            Default Button
          </Button>

          <Button variant={ButtonVariants.OUTLINED} disabled={true}>
            Default Button Disabled
          </Button>
        </div>
      </section>

      <section>
        <SubTitle>Form Button</SubTitle>
        <div className="row">
          <Button variant={ButtonVariants.FORM}>
            Default Button
          </Button>

          <Button variant={ButtonVariants.FORM} disabled={true}>
            Default Button Disabled
          </Button>
        </div>
      </section>

      <section>
        <SubTitle>Link Button</SubTitle>
        <div className="row">
          <Button variant={ButtonVariants.LINK}>
            Default Button
          </Button>

          <Button variant={ButtonVariants.LINK} disabled={true}>
            Default Button Disabled
          </Button>
        </div>
      </section>

      <section>
        <SubTitle>Skeleton Button</SubTitle>
        <div className="row">
          <Button variant={ButtonVariants.SKELETON}>
            Default Button
          </Button>

          <Button variant={ButtonVariants.SKELETON} disabled={true}>
            Default Button Disabled
          </Button>
        </div>
      </section>

    </Container>
  )
}