# Gatsbie Node.js SDK

Official Node.js/TypeScript SDK for the [Gatsbie Captcha API](https://gatsbie.io).

## Installation

```bash
npm install gatsbie
```

## Quick Start

```typescript
import { Client } from "gatsbie";

const client = new Client("gats_your_api_key");

// Solve a Turnstile challenge
const response = await client.solveTurnstile({
  proxy: "http://user:pass@proxy:8080",
  targetUrl: "https://example.com",
  siteKey: "0x4AAAAAAABS7TtLxsNa7Z2e",
});

console.log(response.solution.token);
```

## Error Handling

```typescript
import { Client, APIError } from "gatsbie";

try {
  const response = await client.solveTurnstile(request);
} catch (err) {
  if (err instanceof APIError) {
    if (err.isAuthError()) {
      console.log("Check your API key");
    } else if (err.isInsufficientCredits()) {
      console.log("Add more credits");
    } else if (err.isSolveFailed()) {
      console.log("Solve failed, try again");
    }
  }
}
```

## License

MIT
