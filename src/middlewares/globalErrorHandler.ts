import type {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from "express";

export const globalErrorHandler: ErrorRequestHandler = (
	error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const statusCode = (error as any).statusCode || 500;
	const message = error.message || "Internal Server Error";

	res.status(statusCode).json({
		status: "error",
		message,
	});
};
