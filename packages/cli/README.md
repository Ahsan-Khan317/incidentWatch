# 🧠 Agent CLI (Sidecar Collector)

The **Agent CLI** is a lightweight, standalone process acting as a **sidecar collector** for reliable monitoring and log delivery.

## ⚙️ How It Works

It runs outside your main application to continuously collect data without being impacted by app crashes:

- 📄 **Log Streaming**: Reads application log files (e.g., `tail -f`)
- 🐳 **Docker Logs**: Streams container logs
- 💻 **System Metrics**: Optional CPU/memory signaling

This data is sent to our backend ingestion API, processed via BullMQ, and streamed via Socket.io to the frontend dashboard.

## 🔥 Why It’s Needed

Unlike the in-app SDK, the CLI runs completely independently:

- **App Crashed?** → The CLI keeps running.
- **Logs still writing?** → The CLI continues streaming.
- **Missing Heartbeat?** → System detects downtime accurately.

## 🧩 Integration

Start the CLI alongside your server using a single command:

```bash
npx your-agent start --key=API_KEY --id=SERVER_ID
```
