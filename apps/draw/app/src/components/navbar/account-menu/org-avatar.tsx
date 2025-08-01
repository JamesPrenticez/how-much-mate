import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import multiavatar from '@multiavatar/multiavatar';
import { useOrganisationStore } from '@draw/stores';

const Container = styled.div`
  margin-left: auto;
  display: flex;

  .header {
    margin-left: auto;
    display: flex;
    align-items: center;
    font-family: 'Quicksand', sans-serif;
    text-align: right;

    h1 {
      font-size: 1.2rem;
      line-height: 1.2rem;
      letter-spacing: 0.05rem;

      font-weight: 700;
      color: var(--color-text);
    }

    h2 {
      font-size: 1rem;
      line-height: 1.2rem;
      color: var(--color-text-subtle);
    }
  }

  img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-left: 0.5rem;
  }
`;

export const OrgAvatar = () => {
  const { org } = useOrganisationStore();

  const [imageError, setImageError] = useState(false);

  const base64Avatar = useMemo(() => {
    return `data:image/svg+xml;base64,${btoa(multiavatar(org?.id ?? ''))}`;
  }, [org]);

  return (
    <Container>
      <div className="header">
        <div>
          <h1 className="name">{org?.name}</h1>
          <h2 className="id">{org?.id}</h2>
        </div>
      </div>

      <img
        src={
          imageError || !org?.profilePicture
            ? base64Avatar
            : org?.profilePicture
        }
        alt={org?.name}
        onError={() => setImageError(true)}
      />
    </Container>
  );
};
