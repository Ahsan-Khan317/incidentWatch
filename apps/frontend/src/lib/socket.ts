import { io, Socket } from "socket.io-client";

export const SOCKET_EVENTS = {
  INCIDENT: {
    UPDATED: "incident:updated",
  },
};

class SocketService {
  private socket: Socket | null = null;
  private readonly logSubscriptions = new Map<
    string,
    { orgId?: string; service?: string }
  >();
  private readonly url =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://127.0.0.1:8000";

  private getSubscriptionKey(payload: { orgId?: string; service?: string }) {
    return `${payload.orgId || "*"}::${payload.service || "*"}`;
  }

  private emitActiveLogSubscriptions() {
    if (!this.socket) return;
    this.logSubscriptions.forEach((payload) => {
      this.socket?.emit("subscribe:logs", payload);
    });
  }

  getSocket(): Socket {
    if (!this.socket) {
      this.socket = io(this.url, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected:", this.socket?.id);
        this.emitActiveLogSubscriptions();
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

  subscribeLogs(payload: { orgId?: string; service?: string } = {}) {
    const key = this.getSubscriptionKey(payload);
    this.logSubscriptions.set(key, payload);
    console.log("📡 [SocketLib] Emitting subscribe:logs", payload);
    this.getSocket().emit("subscribe:logs", payload);
  }

  unsubscribeLogs(payload: { orgId?: string; service?: string } = {}) {
    const key = this.getSubscriptionKey(payload);
    this.logSubscriptions.delete(key);
    this.getSocket().emit("unsubscribe:logs", payload);
  }
}

export const socketService = new SocketService();
