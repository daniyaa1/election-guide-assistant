const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const queryRouter = require("./routes/query");

function loadLocalEnv() {
  const envPath = path.join(__dirname, "..", ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const rawEnv = fs.readFileSync(envPath, "utf8");
  const lines = rawEnv.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith("\"") && value.endsWith("\""))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const app = express();
const PORT = process.env.PORT || 5050;
const HOST =
  process.env.HOST ||
  (process.env.RENDER || process.env.NODE_ENV === "production"
    ? "0.0.0.0"
    : "127.0.0.1");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Election Guide Assistant API is running." });
});

app.use("/api/query", queryRouter);

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the process using it or run the server with a different PORT.`
    );
    process.exit(1);
  }

  console.error("Server failed to start:", error.message);
  process.exit(1);
});
