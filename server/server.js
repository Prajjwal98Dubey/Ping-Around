import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import locationRouter from "./routes/location.route.js";
import { connectRedis, getRedisClient } from "./db/connetRedis.js";
import { createClient } from "redis";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const ENV = process.env.NODE_ENV;

app.use(express.json());
dotenv.config({
  path: ENV == "production" ? ".env.production" : ".env.local",
});

// AUTH
app.use("/api/v1/auth", authRouter);

// LOCATION
app.use("/api/v1/location", locationRouter);

// events
let clients = [];
app.get("/api/v1/event/connect", (_, res) => {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });
  clients.push(res);
});

app.post("/api/v1/event/user-detail", async (req, res) => {
  let redisClient = await getRedisClient();
  const details = req.body;
  try {
    await redisClient.publish("channel:new_user", JSON.stringify(details));
  } catch (err) {
    console.log(err);
  }
  return res.json({ message: "message sent!!!" });
});

let subscriber;
subscriber = createClient();
await subscriber.connect();
subscriber.subscribe("channel:new_user", (message) => {
  clients.forEach((res) => {
    res.write(`data:${message}\n\n`);
  });
});

app.listen(5000, async () => {
  await connectRedis();
  console.log(`server listening at ${process.env.PORT || 5000}`);
});
