import request from "supertest";
import app from "../../app.js";
import { describe, it, expect } from "vitest";

describe("POST /validate-card", () => {
	it("returns valid response", async () => {
		const res = await request(app)
			.post("/api/validate")
			.send({ cardNumber: "4111111111111111" });

		expect(res.status).toBe(200);
		expect(res.body.valid).toBe(true);
	});
});
