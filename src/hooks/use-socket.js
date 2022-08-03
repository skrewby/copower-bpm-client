import { useContext } from 'react';
import { SocketContext } from '../contexts/socket-context';

export const useSocket = () => useContext(SocketContext);
