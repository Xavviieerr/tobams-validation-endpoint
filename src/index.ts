import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import validationRoute from "./routes/validationRoute.js";
import type {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
	res.send(
		"Hello 🙂 Just a reminder: today is a new chance to smile, breathe, and enjoy the little things around you.",
	);
});
app.use("/api/validate", validationRoute);

// Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
