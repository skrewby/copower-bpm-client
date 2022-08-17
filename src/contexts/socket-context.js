import { createContext } from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

// Socket is currently defined in AuthGuard
export const SocketContext = createContext();
