import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";

const server = createServer(app);

// Initialize Socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});
