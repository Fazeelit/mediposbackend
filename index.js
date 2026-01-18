// server.js
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

// Load environment variables
dotenv.config();

// ------------------ Database ------------------
import dbConnect from "./config/database.js";
dbConnect();

// ------------------ Config ------------------
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

// ------------------ Express App ------------------
const app = express();

// ------------------ CORS ------------------
const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or server requests
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------ Preflight handler ------------------
// Use regex instead of "*" to avoid PathError
app.options(/.*/, (req, res) => res.sendStatus(204));

// ------------------ Middleware ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ------------------ Root ------------------
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ------------------ API Routes ------------------
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

// ------------------ 404 for API ------------------
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ------------------ Global Error Handler ------------------
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// ------------------ Server ------------------
const PORT = config.port || 8080;
const HOST = "0.0.0.0";

const server = http.createServer(app);

// Optional: adjust timeout (uploads, long requests)
server.timeout = 5 * 60 * 1000; // 5 minutes

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
