# 💳 Tobams Card Validation API

A lightweight, privacy-first REST API that validates credit/debit card numbers using the **Luhn algorithm**, detects the card network (Visa, Mastercard, Amex, Discover), and returns a clean JSON response. Built with **Express**, **TypeScript**, and **Vitest**.

---

## 🌐 Deployment Link

#(https://tobams-validation-endpoint.vercel.app)

---

## ✨ Features Overview

| Feature                     | Description                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| **Luhn Validation**         | Validates card numbers using the industry-standard Luhn (mod 10) algorithm |
| **Card Type Detection**     | Identifies Visa, Mastercard, American Express, and Discover cards          |
| **Input Sanitisation**      | Strips spaces and dashes before validation — accepts human-friendly input  |
| **Anonymous Rate Limiting** | IP-based throttle of 100 requests per 15 minutes — no user tracking        |
| **Request Logging**         | Console logs every request with method, path, status code, and duration    |
| **Global Error Handling**   | Centralised error middleware returns consistent `{ status, message }` JSON |
| **Strict TypeScript**       | Full strict mode, ESM modules, and `verbatimModuleSyntax` enforced         |
| **Unit Tested**             | Service logic and HTTP integration tested with Vitest + Supertest          |

---

## 🏗️ Architecture & Folder Structure

```
tobams-validation-endpoint/
├── src/
│   ├── server.ts                  # Entry point — boots the HTTP server
│   ├── app.ts                     # Express app config (middleware, routes)
│   │
│   ├── routes/
│   │   └── validationRoute.ts     # POST / → validateCard controller
│   │
│   ├── controllers/
│   │   └── validationController.ts  # Parses request, calls service, sends response
│   │
│   ├── services/
│   │   └── cardService.ts         # Orchestrates sanitisation, Luhn check, type detection
│   │
│   ├── utils/
│   │   ├── cardValidator.ts       # sanitizeCardNumber, isDigitsOnly, luhnCheck
│   │   ├── cardType.ts            # getCardType — regex-based network detection
│   │   └── AppError.ts            # Custom error class with statusCode
│   │
│   ├── middlewares/
│   │   ├── rateLimiter.ts         # express-rate-limit (100 req / 15 min)
│   │   ├── logger.ts              # Request duration logger
│   │   └── globalErrorHandler.ts  # Centralised error response formatter
│   │
│   └── tests/
│       └── unit/
│           ├── card.service.test.ts  # Unit tests for validateCardService
│           └── card.api.test.ts      # Integration tests for POST /api/validate
│
├── vitest.config.ts               # Vitest configuration (node environment)
├── tsconfig.json                  # TypeScript configuration
├── package.json
├── .env                           # Environment variables (PORT)
└── .gitignore
```

The project follows a **layered architecture**:

```
Request → Middleware (rate limit, logger) → Route → Controller → Service → Utils → Response
```

---

## 📦 Data Model

This API is stateless — it has no database. All inputs and outputs are plain JSON.

### Request Body — `POST /api/validate`

```json
{
	"cardNumber": "4111 1111 1111 1111"
}
```

| Field        | Type     | Required | Notes                                            |
| ------------ | -------- | -------- | ------------------------------------------------ |
| `cardNumber` | `string` | ✅       | Spaces and dashes are stripped before processing |

### Success Response — `200 OK`

```json
{
	"valid": true,
	"type": "Visa"
}
```

| Field   | Type      | Description                                                                                    |
| ------- | --------- | ---------------------------------------------------------------------------------------------- |
| `valid` | `boolean` | `true` if the card number passes the Luhn check                                                |
| `type`  | `string`  | Detected network: `"Visa"`, `"Mastercard"`, `"American Express"`, `"Discover"`, or `"Unknown"` |

### Error Response — `400 Bad Request`

```json
{
	"status": "error",
	"message": "cardNumber is required"
}
```

### Rate Limit Response — `429 Too Many Requests`

```json
{
	"status": "error",
	"message": "Too many requests, please try again later."
}
```

---

## 🔑 Key Logic Explanation

### 1. Input Sanitisation (`cardValidator.ts`)

Before any validation, the raw card number string is sanitised:

```ts
sanitizeCardNumber("4111 1111-1111 1111");
// → "4111111111111111"
```

This allows users to submit naturally formatted card numbers.

### 2. Luhn Algorithm (`cardValidator.ts → luhnCheck`)

The Luhn (mod 10) algorithm is the industry standard for detecting transcription errors in card numbers:

1. Reverse the digits
2. Double every second digit (from the right); if doubling gives > 9, subtract 9
3. Sum all digits
4. If the total is divisible by 10 → **valid**

```ts
luhnCheck("4111111111111111"); // → true
luhnCheck("1234567890123456"); // → false
```

### 3. Card Type Detection (`cardType.ts`)

Network identification is done with prefix-based regex matching:

| Network          | Pattern                                      |
| ---------------- | -------------------------------------------- |
| Visa             | Starts with `4`                              |
| Mastercard       | Starts with `51–55` or IIN range `2221–2720` |
| American Express | Starts with `34` or `37`                     |
| Discover         | Starts with `6011`, `65`, or `644–649`       |

### 4. Service Composition (`cardService.ts`)

The service layer ties everything together:

```ts
export const validateCardService = (cardNumber: string) => {
	const sanitized = sanitizeCardNumber(cardNumber);
	if (!sanitized || !isDigitsOnly(sanitized))
		return { valid: false, type: "Unknown" };
	return { valid: luhnCheck(sanitized), type: getCardType(sanitized) };
};
```

### 5. Rate Limiting (`rateLimiter.ts`)

Anonymous IP-based throttling via `express-rate-limit`:

- **Window**: 15 minutes
- **Max requests**: 100 per window
- **Headers**: `RateLimit-*` standard headers returned; legacy `X-RateLimit-*` suppressed

---

## 🔀 Routing & App Flow

```
POST /api/validate
       │
       ▼
  requestLogger        ← logs method, path, status, duration
       │
       ▼
  apiRateLimiter       ← blocks if > 100 req in 15 min from same IP
       │
       ▼
  validationRoute      ← mounted at /api/validate
       │
       ▼
  validateCard         ← controller: validates input, calls service
       │
       ▼
  validateCardService  ← service: sanitise → luhn → type detect
       │
       ▼
  200 { valid, type }  ← or globalErrorHandler on failure
```

All routes:

| Method | Path            | Description                               |
| ------ | --------------- | ----------------------------------------- |
| `GET`  | `/`             | Health check — returns `"API is running"` |
| `POST` | `/api/validate` | Validates a card number                   |

---

## 🧪 Testing Strategy

Tests live in `src/tests/unit/` and are run with **Vitest** and **Supertest**.

### Test Files

| File                   | Type        | What It Tests                                         |
| ---------------------- | ----------- | ----------------------------------------------------- |
| `card.service.test.ts` | Unit        | `validateCardService` — pure logic, no HTTP           |
| `card.api.test.ts`     | Integration | Full HTTP cycle via Supertest against the Express app |

### Philosophy

- **Unit tests** isolate the service layer to verify the Luhn + type detection logic independently of Express.
- **Integration tests** mount the real app and send actual HTTP requests, confirming the full middleware → controller → service chain works end-to-end.
- No mocking is used — the service is fast and pure enough to run directly.

### Example

```ts
// card.service.test.ts
it("valid Visa card", () => {
	const result = validateCardService("4111111111111111");
	expect(result.valid).toBe(true);
	expect(result.type).toBe("Visa");
});

// card.api.test.ts
it("returns valid response", async () => {
	const res = await request(app)
		.post("/api/validate")
		.send({ cardNumber: "4111111111111111" });
	expect(res.status).toBe(200);
	expect(res.body.valid).toBe(true);
});
```

---

## 🚀 How to Run the Project

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone <repo-url>
cd tobams-validation-endpoint

# 2. Install dependencies
npm install

# 3. Create your environment file
echo "PORT=3000" > .env

# 4. Start the development server (with hot reload via nodemon + tsx)
npm run dev
```

The server will be available at `http://localhost:3000`.

**Example request:**

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111 1111 1111 1111"}'
```

**Expected response:**

```json
{ "valid": true, "type": "Visa" }
```

---

## 🧪 How to Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

Vitest will automatically discover and run all `*.test.ts` files under `src/`.

---

## ⚙️ Environment & Assumptions

### Environment Variables

| Variable | Default | Description                     |
| -------- | ------- | ------------------------------- |
| `PORT`   | `3000`  | Port the HTTP server listens on |

Create a `.env` file in the project root (already present in the repo for convenience):

```env
PORT=3000
```

### Assumptions

- **No database required** — validation is stateless and purely computational.
- **No authentication** — the API is public and protected only by rate limiting.
- **Card numbers are strings** — numeric types are not accepted to avoid leading-zero loss.
- **Input may contain spaces or dashes** — these are stripped automatically.
- **Card length is not validated** — the Luhn algorithm is the sole validity gate (length validation exists in `validateCardNumber` utility but is not called in the service to keep the check permissive).

---

## 🤔 Challenges & Decisions

### 1. `module: "nodenext"` vs ESM interop

Choosing `"module": "nodenext"` in `tsconfig.json` enforces strict ESM — all local imports must use `.js` extensions (even for `.ts` source files). This avoids runtime resolution errors when running the compiled output but requires discipline in every import statement.

### 2. `vitest.config.ts` outside `rootDir`

The TypeScript compiler (`rootDir: "./src"`) rejected `vitest.config.ts` at the project root with a `TS6059` error. The fix was to remove it from the `include` array — Vitest picks it up automatically without TypeScript needing to type-check it.

### 3. Route mounting vs route path

The validation route is mounted at `/api/validate` in `app.ts`. The router internally handles `/` (root), so the effective endpoint is `POST /api/validate`. This avoids the duplication of `/api/validate/validate-card`.

### 4. Anonymous rate limiting

`express-rate-limit` uses the request IP by default — no cookies, no sessions, no user tracking. This satisfies a privacy-first design requirement while still protecting against abuse.

### 5. Stateless design

Keeping the API fully stateless (no DB, no cache) means it is trivially horizontally scalable and has zero infrastructure dependencies beyond Node.js.

---

## 🔮 Future Improvements

- [ ] **More card networks** — add UnionPay, Maestro, JCB, Diners Club
- [ ] **CI/CD pipeline** — GitHub Actions to run tests on every push
- [ ] **Redis-backed rate limiting** — persistent across server restarts and multiple instances
- [ ] **Request ID tracing** — inject a unique `X-Request-ID` header for log correlation
- [ ] **Docker support** — `Dockerfile` and `docker-compose.yml` for containerised dev/prod environments

---

## 👤 Author / Submission Info

| Field             | Value                                               |
| ----------------- | --------------------------------------------------- |
| **Project**       | Tobams Card Validation Endpoint                     |
| **Stack**         | Node.js · Express · TypeScript · Vitest · Supertest |
| **Submitted for** | Tobams Backend Assessment                           |
