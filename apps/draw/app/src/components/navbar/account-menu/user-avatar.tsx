import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import multiavatar from '@multiavatar/multiavatar';

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

const user = {
  id: "asd4fa46sd",
  displayName: 'James Prentice',
  email: 'james.prentice@matica.com',
  profilePicture: '',
};

export const UserAvatar = () => {
  const [imageError, setImageError] = useState(false);

  const base64Avatar = useMemo(() => {
    return `data:image/svg+xml;base64,${btoa(multiavatar(user?.id ?? ''))}`;
  }, []);

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
