// ============================================================================
// Response Types
// ============================================================================

/** Response from the health check endpoint. */
export interface HealthResponse {
  status: string;
}

/** Generic response for successful captcha solves. */
export interface SolveResponse<T> {
  success: boolean;
  taskId: string;
  service: string;
  solution: T;
  cost: number;
  solveTime: number;
}

// ============================================================================
// Solution Types
// ============================================================================

/** Solution for Datadome challenges. */
export interface DatadomeSolution {
  datadome: string;
  userAgent: string;
}

/** Solution for reCAPTCHA v3 challenges. */
export interface RecaptchaV3Solution {
  token: string;
  userAgent: string;
}

/** Solution for Akamai challenges. */
export interface AkamaiSolution {
  abck: string;
  bmSz: string;
  userAgent: string;
  country?: string;
  usrLocale?: string;
}

/** Solution for Vercel challenges. */
export interface VercelSolution {
  vcrcs: string;
  userAgent: string;
}

/**
 * Solution for Shape challenges.
 * Shape uses dynamic header names that vary by site.
 */
export interface ShapeSolution {
  headers: Record<string, string>;
  userAgent: string;
}

/** Solution for Cloudflare Turnstile challenges. */
export interface TurnstileSolution {
  token: string;
  userAgent: string;
}

/** PerimeterX cookies needed for requests. */
export interface PerimeterXCookies {
  px3: string;
  pxde: string;
  pxvid: string;
  pxcts: string;
}

/** Solution for PerimeterX challenges. */
export interface PerimeterXSolution {
  cookies: PerimeterXCookies;
  userAgent: string;
}

/** Solution for Cloudflare WAF challenges. */
export interface CloudflareWAFSolution {
  cfClearance: string;
  userAgent: string;
}

/** Solution for Datadome Slider challenges. */
export interface DatadomeSliderSolution {
  datadome: string;
  userAgent: string;
}

// ============================================================================
// Request Types
// ============================================================================

/** Request for solving Datadome device check challenges. */
export interface DatadomeRequest {
  proxy: string;
  targetUrl: string;
  targetMethod?: string;
}

/** Request for solving reCAPTCHA v3 challenges. */
export interface RecaptchaV3Request {
  proxy: string;
  targetUrl: string;
  siteKey: string;
  action?: string;
  title?: string;
  enterprise?: boolean;
}

/** Request for solving Akamai challenges. */
export interface AkamaiRequest {
  proxy: string;
  targetUrl: string;
  akamaiJsUrl: string;
  pageFp?: string;
}

/** Request for solving Vercel challenges. */
export interface VercelRequest {
  proxy: string;
  targetUrl: string;
}

/** Request for solving Shape challenges. */
export interface ShapeRequest {
  proxy: string;
  targetUrl: string;
  targetApi: string;
  shapeJsUrl: string;
  title: string;
  method: string;
}

/** Request for solving Cloudflare Turnstile challenges. */
export interface TurnstileRequest {
  proxy: string;
  targetUrl: string;
  siteKey: string;
}

/** Request for solving PerimeterX challenges. */
export interface PerimeterXRequest {
  proxy: string;
  targetUrl: string;
  perimeterxJsUrl: string;
  pxAppId: string;
}

/** Request for solving Cloudflare WAF challenges. */
export interface CloudflareWAFRequest {
  proxy: string;
  targetUrl: string;
  targetMethod?: string;
}

/** Request for solving Datadome Slider challenges. */
export interface DatadomeSliderRequest {
  proxy: string;
  targetUrl: string;
  targetMethod?: string;
}

// ============================================================================
// Client Options
// ============================================================================

/** Options for configuring the Gatsbie client. */
export interface ClientOptions {
  /** Custom base URL for the API. */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 120000). */
  timeout?: number;
}
