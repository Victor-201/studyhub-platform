import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

const SOCKET_URL =
  import.meta.env.VITE_CHAT_SERVICE_URL || "http://localhost:3006";

export default function useSocket() {
  const { user, accessToken } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user || !accessToken) return;

    // cleanup socket cũ nếu có
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: accessToken },
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("[Socket] Disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Error:", err.message);
    });

    return () => {
      socket.off();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user?.id, accessToken]);

  // ================= EMIT =================
  const emit = useCallback((event, payload) => {
    socketRef.current?.emit(event, payload);
  }, []);

  // ================= ON / OFF =================
  const on = useCallback((event, cb) => {
    socketRef.current?.on(event, cb);
  }, []);

  const off = useCallback((event, cb) => {
    socketRef.current?.off(event, cb);
  }, []);

  return {
    connected,
    emit,
    on,
    off,
  };
}
