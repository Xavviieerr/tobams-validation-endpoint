import type { Request, Response, NextFunction } from "express";
import { validateCardService } from "../services/cardService.js";
import { AppError } from "../utils/AppError.js";

export const validateCard = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { cardNumber } = req.body;

		if (!cardNumber || typeof cardNumber !== "string") {
			throw new AppError("cardNumber is required", 400);
		}

		const isValid = validateCardService(cardNumber);

		return res.status(200).json({
			valid: isValid,
		});
	} catch (error) {
		next(error);
	}
};
