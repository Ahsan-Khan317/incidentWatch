import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private readonly url =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://127.0.0.1:8000";

  getSocket(): Socket {
    if (!this.socket) {
      this.socket = io(this.url, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
