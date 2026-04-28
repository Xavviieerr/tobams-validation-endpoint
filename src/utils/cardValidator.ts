export const sanitizeCardNumber = (input: string): string => {
	return input.replace(/\s|-/g, "");
};

export const isDigitsOnly = (input: string): boolean => {
	return /^\d+$/.test(input);
};

export const luhnCheck = (num: string): boolean => {
	const digits = num.split("").reverse().map(Number);

	const sum = digits.reduce((acc, digit, index) => {
		if (index % 2 === 1) {
			let doubled = digit * 2;
			if (doubled > 9) doubled -= 9;
			return acc + doubled;
		}
		return acc + digit;
	}, 0);

	return sum % 10 === 0;
};

export const validateCardNumber = (cardNumber: string): boolean => {
	const sanitized = sanitizeCardNumber(cardNumber);

	if (!sanitized) return false;
	if (!isDigitsOnly(sanitized)) return false;
	if (sanitized.length < 12 || sanitized.length > 19) return false;

	return luhnCheck(sanitized);
};
