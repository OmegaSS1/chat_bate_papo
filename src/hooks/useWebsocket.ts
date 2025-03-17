import { useEffect, useState } from "react";

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // const [messages, setMessages] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("🔗 Conectado ao WebSocket!");
    // ws.onmessage = (event) => setMessages(event.data);
    // ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    // ws.onclose = () => window.location.href = '/';

    setSocket(ws);

    return () => ws.close(); // Fecha a conexão ao desmontar
  }, [url]);

  // const sendMessage = (message: string) => {
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     socket.send(message);
  //   }
  // };

  return { socket };
}
