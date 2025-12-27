/**
 * Gatsbie SDK - Official Node.js SDK for the Gatsbie Captcha API.
 *
 * @example
 * ```typescript
 * import { Client } from "gatsbie";
 *
 * const client = new Client("gats_your_api_key");
 *
 * const response = await client.solveTurnstile({
 *   proxy: "http://user:pass@proxy:8080",
 *   targetUrl: "https://example.com",
 *   siteKey: "0x4AAAAAAABS7TtLxsNa7Z2e",
 * });
 *
 * console.log(response.solution.token);
 * ```
 */

export { Client } from "./client";
export {
  APIError,
  ErrorCode,
  GatsbieError,
  RequestError,
} from "./errors";
export type {
  // Response types
  HealthResponse,
  SolveResponse,
  // Solution types
  AkamaiSolution,
  CloudflareWAFSolution,
  DatadomeSliderSolution,
  DatadomeSolution,
  PerimeterXCookies,
  PerimeterXSolution,
  RecaptchaV3Solution,
  ShapeSolution,
  TurnstileSolution,
  VercelSolution,
  // Request types
  AkamaiRequest,
  CloudflareWAFRequest,
  DatadomeRequest,
  DatadomeSliderRequest,
  PerimeterXRequest,
  RecaptchaV3Request,
  ShapeRequest,
  TurnstileRequest,
  VercelRequest,
  // Options
  ClientOptions,
} from "./types";
