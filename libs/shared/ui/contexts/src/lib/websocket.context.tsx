import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider = ({
  children,
  url,
}: {
  children: ReactNode;
  url: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');

    const s = io(url, {
      autoConnect: true,
      auth: {
        session,
      },
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [url]);

  if (!socket) return null;

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = (): Socket => {
  const socket = useContext(WebSocketContext);
  if (!socket) throw new Error('useSocket must be used within WebSocketProvider');
  return socket;
};
