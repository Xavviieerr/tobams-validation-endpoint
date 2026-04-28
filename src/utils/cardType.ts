export const getCardType = (cardNumber: string): string => {
	if (/^4/.test(cardNumber)) return "Visa";

	if (
		/^5[1-5]/.test(cardNumber) ||
		/^2(2[2-9]|[3-6][0-9]|7[01]|720)/.test(cardNumber)
	) {
		return "Mastercard";
	}

	if (/^3[47]/.test(cardNumber)) return "American Express";

	if (/^6(011|5|4[4-9])/.test(cardNumber)) return "Discover";

	return "Unknown";
};
