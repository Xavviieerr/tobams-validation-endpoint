import type { Request, Response, NextFunction } from "express";

export const validateCard = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { cardNumber } = req.body;
		const isValid = true;

		return res.status(200).json({
			valid: isValid,
		});
	} catch (error) {
		next(error);
	}
};
