import { spawn } from "child_process";
import axios from "axios";

const API = "http://localhost:5000";

const file = process.argv[2] || "app.log";

console.log("Reading logs from:", file);

const tail = spawn("tail", ["-f", file]);

tail.stdout.on("data", (data) => {
  axios.post(`${API}/logs`, {
    type: "file-log",
    message: data.toString(),
    ts: Date.now(),
  });
});
