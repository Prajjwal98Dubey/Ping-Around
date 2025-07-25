import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import locationRouter from "./routes/location.route.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const ENV = process.env.NODE_ENV

app.use(express.json());
dotenv.config({
  path: ENV == "production" ? ".env.production" : ".env.local",
});

// AUTH
app.use("/api/v1/auth", authRouter);

// LOCATION
app.use("/api/v1/location", locationRouter);

app.listen(5000, () => {	
  console.log(`server listening at ${process.env.PORT || 5000}`);
});
