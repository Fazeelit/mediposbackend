import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

dotenv.config();

import dbConnect from "./config/database.js";
import config from "./config/config.js";

import userRoutes from "./routes/usersroute.js";
import adminRoutes from "./routes/adminroute.js";
import bookRoutes from "./routes/bookRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import helplinRoutes from "./routes/helplineRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// ------------------ DB ------------------
dbConnect();

const app = express();

// ------------------ CORS (PRODUCTION SAFE) ------------------
const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server
      if (!origin) return callback(null, true);

      // Allow localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow ALL Vercel deployments (prod + preview)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 FIX PREFLIGHT REQUESTS
app.options("*", cors());

// ------------------ Middleware ------------------
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ extended: true, limit: "2gb" }));
app.use(morgan("dev"));

// ------------------ Root ------------------
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ------------------ Routes ------------------
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/helpline", helplinRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/messages", messageRoutes);

// ------------------ 404 API ------------------
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ------------------ Error Handler ------------------
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ------------------ Server ------------------
const PORT = config.port || 8080;
const HOST = "0.0.0.0";

const server = http.createServer(app);
server.timeout = 2 * 60 * 60 * 1000;

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
