import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

dotenv.config();

import dbConnect from "./config/database.js";
import config from "./config/config.js";

// ------------------ Routes ------------------
// Make sure these files exist in ./routes folder
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

// ------------------ Connect DB ------------------
dbConnect();

const app = express();

// ------------------ CORS ------------------
const allowedOrigins = [
  "http://localhost:3000", // local frontend
  "http://0.0.0.0:8080",
  "https://mediposfrontendproject.vercel.app/"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ------------------ Middleware ------------------
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ extended: true, limit: "2gb" }));
app.use(morgan("dev"));

// ------------------ Root ------------------
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ------------------ API Routes ------------------
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
app.use("/api/users", userManagementRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/categories", categoryRoutes);

// ------------------ 404 API ------------------
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ------------------ Error Handler ------------------
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);
  res.status(500).json({ message: err.message });
});

// ------------------ Server ------------------
const PORT = config.port || 8080;
const HOST = "0.0.0.0";

const server = http.createServer(app);
server.timeout = 2 * 60 * 60 * 1000; // 2 hours

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
