// Importa las librerías necesarias
import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Constants } from '@/constants';

const SocketIOContext = createContext<Socket | null>(null)

export const useSocket = () => {
    return useContext(SocketIOContext);
};

export const SocketIOProvider = ({ children }: any) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(Constants.BACKEND_URL, {
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('[SOCKET.IO] Connected to server');
        });
        setSocket(newSocket);
    }, []);

    return (
        <SocketIOContext.Provider value={socket}>
            {children}
        </SocketIOContext.Provider>
    );
};

