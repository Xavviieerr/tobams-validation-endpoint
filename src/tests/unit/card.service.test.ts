import { describe, it, expect } from "vitest";
import { validateCardService } from "../../services/cardService.js";

describe("Card Service", () => {
	it("valid Visa card", () => {
		const result = validateCardService("4111111111111111");

		expect(result.valid).toBe(true);
		expect(result.type).toBe("Visa");
	});
});
