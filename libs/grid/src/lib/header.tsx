import styled from '@emotion/styled';

const Container = styled.div`
  padding: 4px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 'white';
  cursor: pointer;

  &.isEditing {
    background-color: #eef;
  }
`;

interface HeaderProps {
  title: string;
};

export const Header = ({title}: HeaderProps) => {
  return (
    <Container>
      {title}
    </Container>
  )
};
