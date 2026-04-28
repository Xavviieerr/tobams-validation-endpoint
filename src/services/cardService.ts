import {
	sanitizeCardNumber,
	isDigitsOnly,
	luhnCheck,
} from "../utils/cardValidator.js";
import { getCardType } from "../utils/cardType.js";

export const validateCardService = (cardNumber: string) => {
	const sanitized = sanitizeCardNumber(cardNumber);

	if (!sanitized || !isDigitsOnly(sanitized)) {
		return {
			valid: false,
			type: "Unknown",
		};
	}

	const valid = luhnCheck(sanitized);
	const type = getCardType(sanitized);

	return {
		valid,
		type,
	};
};
