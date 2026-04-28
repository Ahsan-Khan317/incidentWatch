import axios from "axios";

interface InitOptions {
  apiKey: string;
  serverId: string;
}

export function init({ apiKey, serverId }: InitOptions) {
  const API = "http://localhost:5000";

  function send(type: string, message: any) {
    axios.post(`${API}/logs`, {
      apiKey,
      serverId,
      type,
      message,
      ts: Date.now(),
    });
  }

  // 🔁 heartbeat
  setInterval(() => {
    send("heartbeat", "alive");
  }, 30000);

  // 🔴 errors
  process.on("uncaughtException", (err) => {
    send("error", err.message);
  });

  process.on("unhandledRejection", (err) => {
    send("error", err);
  });

  // console override
  const orig = console.error;
  console.error = (...args) => {
    send("error", args.join(" "));
    orig(...args);
  };
}
