import styled from '@emotion/styled';
import { useState } from 'react';
import multiavatar from '@multiavatar/multiavatar';

const Container = styled.div`
  margin-left: auto;
  display: flex;

  .header {
    margin-left: auto;
    display: flex;
    align-items: center;
    font-weight: 600;
    text-align: right;

    h1 {
      font-size: 1.2rem;
      line-height: 1.2rem;
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

export const Avatar = () => {
  const user = {
    displayName: 'Sam Altman',
    email: 'sam.altmanasddf@matica.com',
    profilePicture: '',
  };


  const [imageError, setImageError] = useState(false);

  const base64Avatar = `data:image/svg+xml;base64,${btoa(
    multiavatar(user?.email ?? '')
  )}`;

  return (
    <Container>
      <div className="header">
        <div>
          <h1 className="display-name">{user?.displayName}</h1>
          <h2 className="email">{user?.email}</h2>
        </div>
      </div>

      <img
        src={
          imageError || !user?.profilePicture
            ? base64Avatar
            : user?.profilePicture
        }
        alt={user?.displayName}
        onError={() => setImageError(true)}
      />

    </Container>
  );
};
