import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carbonEmisionRoutes from "./routes/carbon-emision-routes.js";
import checkApiKeyExists from "./middleware/check-api-key.js";

dotenv.config();

const app = express();
const PORT = 3100;

app.use(cors());
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", checkApiKeyExists, carbonEmisionRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
