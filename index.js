import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

dotenv.config();

import dbConnect from "./config/database.js";
import config from "./config/config.js";

// Routes
import userRoutes from "./routes/usersroute.js";
import adminRoutes from "./routes/adminroute.js";
import productRoutes from "./routes/productsRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import userManagementRoutes from "./routes/UserManagementRoutes.js";
import roleRoutes from "./routes/RoleRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

// DB
dbConnect();

const app = express();

/* =======================
   CORS
======================= */
const allowedOrigins = [
  "http://localhost:3000",
  "https://mediposfrontendproject.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =======================
   Middleware
======================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

/* =======================
   Root
======================= */
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

/* =======================
   API Routes
======================= */
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/user-management", userManagementRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/categories", categoryRoutes);

/* =======================
   404 API
======================= */
app.all("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

/* =======================
   Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

/* =======================
   Server
======================= */
const PORT = config.port || 8080;
const HOST = "0.0.0.0";

const server = http.createServer(app);
server.timeout = 5 * 60 * 1000; // 5 minutes

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
