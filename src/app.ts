import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import validationRoute from "./routes/validationRoute.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { requestLogger } from "./middlewares/logger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(apiRateLimiter);

// routes
app.get("/", (req, res) => {
	res.send("API is running");
});

app.use("/api/validate", validationRoute);

app.use(globalErrorHandler);

export default app;
