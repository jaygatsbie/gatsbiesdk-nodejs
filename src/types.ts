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

/** Cookies returned by Akamai. */
export interface AkamaiCookies {
  abck: string;
  bmSz: string;
  country?: string;
  usrLocale?: string;
}

/** Solution for Akamai challenges. */
export interface AkamaiSolution {
  cookies: AkamaiCookies;
  userAgent: string;
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

/** Cookies returned by Cloudflare WAF. */
export interface CloudflareWAFCookies {
  cfClearance: string;
}

/** Solution for Cloudflare WAF challenges. */
export interface CloudflareWAFSolution {
  cookies: CloudflareWAFCookies;
  userAgent: string;
}

/** Solution for Datadome Slider challenges. */
export interface DatadomeSliderSolution {
  datadome: string;
  userAgent: string;
}

/** Cookies returned by CaptchaFox. */
export interface CaptchaFoxCookies {
  bmS: string;
  bmSc: string;
}

/** Solution for CaptchaFox challenges. */
export interface CaptchaFoxSolution {
  cookie: CaptchaFoxCookies;
  userAgent: string;
}

/** Solution for Castle challenges. */
export interface CastleSolution {
  token: string;
  userAgent: string;
}

/** Solution for Incapsula Reese84 challenges. */
export interface Reese84Solution {
  reese84: string;
  userAgent: string;
}

/** Solution for Forter challenges. */
export interface ForterSolution {
  token: string;
  userAgent: string;
}

/** Solution for Funcaptcha challenges. */
export interface FuncaptchaSolution {
  token: string;
  userAgent: string;
}

/** Solution for Akamai SBSD challenges. */
export interface SBSDSolution {
  bmS: string;
  bmSc: string;
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

/** Request for solving CaptchaFox challenges. */
export interface CaptchaFoxRequest {
  proxy: string;
  targetUrl: string;
  siteKey: string;
}

/** Castle configuration parameters. */
export interface CastleConfigJSON {
  avoidCookies?: boolean;
  pk: string;
  wUrl: string;
  swUrl: string;
}

/** Request for solving Castle challenges. */
export interface CastleRequest {
  proxy: string;
  targetUrl: string;
  configJson: CastleConfigJSON;
}

/** Request for solving Incapsula Reese84 challenges. */
export interface Reese84Request {
  proxy: string;
  reese84JsUrl: string;
}

/** Request for solving Forter challenges. */
export interface ForterRequest {
  proxy: string;
  targetUrl: string;
  forterJsUrl: string;
  siteId: string;
}

/** Request for solving Funcaptcha challenges. */
export interface FuncaptchaRequest {
  proxy: string;
  targetUrl: string;
  customApiHost: string;
  publicKey: string;
}

/** Request for solving Akamai SBSD challenges. */
export interface SBSDRequest {
  proxy: string;
  targetUrl: string;
  targetMethod: string;
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
