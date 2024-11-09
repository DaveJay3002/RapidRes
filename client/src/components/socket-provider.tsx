import type { SocketStateType } from "@/lib/types";
import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext<SocketStateType>({} as SocketStateType);

export const SocketProvider = (props: { children: React.ReactNode }) => {
  const socket = useMemo(
    () => io("http://localhost:5000"),
    []
  );
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}
