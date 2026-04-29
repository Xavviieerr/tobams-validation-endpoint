import {
	sanitizeCardNumber,
	validateCardNumber,
} from "../utils/cardValidator.js";
import { getCardType } from "../utils/cardType.js";

export const validateCardService = (cardNumber: string) => {
	const sanitized = sanitizeCardNumber(cardNumber);

	if (!sanitized) {
		return {
			valid: false,
			type: "Unknown",
		};
	}

	const valid = validateCardNumber(cardNumber);
	const type = getCardType(sanitized);

	return {
		valid,
		type,
	};
};
