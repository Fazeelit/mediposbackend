import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

// ================== ENV ==================
dotenv.config();

// ================== IMPORTS ==================
import dbConnect from "./config/database.js";
import config from "./config/config.js";

// ------------------ Routes ------------------
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
import categoryRoutes from "./routes/categoryRoutes.js";
import testParameterRoutes from "./routes/testParameterroutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";

// ================== APP ==================
const app = express();

// ================== ENV VALIDATION ==================
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in .env");
  process.exit(1);
}

// ================== CORS ==================
const allowedOrigins = process.env.WEBAPP_URL
  ? process.env.WEBAPP_URL.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================== PREFLIGHT ==================
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend is running!");
});

// ================== API ROUTES ==================
app.use("/api/user-management", userManagementRoutes);
app.use("/api/products", productRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/testParameters", testParameterRoutes);
app.use("/api/suppliers", supplierRoutes);

// ================== API 404 ==================
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("❌ Error Stack:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

// ================== PROCESS SAFETY ==================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// ================== SERVER START ==================
const PORT = config.port || process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

(async () => {
  try {
    await dbConnect();

    const server = http.createServer(app);
    server.timeout = 5 * 60 * 1000;

    server.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
