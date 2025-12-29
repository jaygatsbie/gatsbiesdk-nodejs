import { APIError, RequestError } from "./errors";
import type {
  AkamaiRequest,
  AkamaiSolution,
  CaptchaFoxRequest,
  CaptchaFoxSolution,
  CastleRequest,
  CastleSolution,
  ClientOptions,
  CloudflareWAFRequest,
  CloudflareWAFSolution,
  DatadomeRequest,
  DatadomeSliderRequest,
  DatadomeSliderSolution,
  DatadomeSolution,
  ForterRequest,
  ForterSolution,
  FuncaptchaRequest,
  FuncaptchaSolution,
  HealthResponse,
  PerimeterXRequest,
  PerimeterXSolution,
  RecaptchaRequest,
  RecaptchaEnterpriseRequest,
  RecaptchaSolution,
  Reese84Request,
  Reese84Solution,
  SBSDRequest,
  SBSDSolution,
  ShapeRequest,
  ShapeSolution,
  ShapeV2Request,
  ShapeV2Solution,
  SolveResponse,
  TurnstileRequest,
  TurnstileSolution,
  VercelRequest,
  VercelSolution,
} from "./types";

const DEFAULT_BASE_URL = "https://api2.gatsbie.io";
const DEFAULT_TIMEOUT = 120000;

/**
 * Gatsbie API client.
 *
 * @example
 * ```typescript
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
export class Client {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Create a new Gatsbie API client.
   *
   * @param apiKey - Your Gatsbie API key (should start with 'gats_').
   * @param options - Optional client configuration.
   */
  constructor(apiKey: string, options: ClientOptions = {}) {
    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const error = (data.error as Record<string, unknown>) || {};
        throw new APIError({
          code: (error.code as string) || "UNKNOWN",
          message: (error.message as string) || "Unknown error",
          details: error.details as string | undefined,
          timestamp: error.timestamp as number | undefined,
          httpStatus: response.status,
        });
      }

      return data as T;
    } catch (err) {
      if (err instanceof APIError) {
        throw err;
      }
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new RequestError("Request timed out", err);
        }
        throw new RequestError(`Request failed: ${err.message}`, err);
      }
      throw new RequestError("Request failed");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ========================================================================
  // API Methods
  // ========================================================================

  /**
   * Check the API server health status.
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("GET", "/health");
  }

  /**
   * Solve a Datadome device check challenge.
   */
  async solveDatadome(
    request: DatadomeRequest
  ): Promise<SolveResponse<DatadomeSolution>> {
    const body = {
      task_type: "datadome-device-check",
      proxy: request.proxy,
      target_url: request.targetUrl,
      target_method: request.targetMethod ?? "GET",
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { datadome: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/datadome-device-check", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        datadome: data.solution.datadome,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a reCAPTCHA v2/v3 (Universal) challenge.
   */
  async solveRecaptcha(
    request: RecaptchaRequest
  ): Promise<SolveResponse<RecaptchaSolution>> {
    const body: Record<string, unknown> = {
      task_type: "recaptcha",
      proxy: request.proxy,
      target_url: request.targetUrl,
      site_key: request.siteKey,
      size: request.size,
      title: request.title,
    };
    if (request.action) body.action = request.action;
    if (request.ubd) body.ubd = request.ubd;

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { token: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/recaptcha", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        token: data.solution.token,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a reCAPTCHA Enterprise challenge.
   */
  async solveRecaptchaEnterprise(
    request: RecaptchaEnterpriseRequest
  ): Promise<SolveResponse<RecaptchaSolution>> {
    const body: Record<string, unknown> = {
      task_type: "recaptcha_enterprise",
      proxy: request.proxy,
      target_url: request.targetUrl,
      site_key: request.siteKey,
      size: request.size,
      title: request.title,
    };
    if (request.action) body.action = request.action;
    if (request.ubd) body.ubd = request.ubd;
    if (request.sa) body.sa = request.sa;

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { token: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/recaptcha-enterprise", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        token: data.solution.token,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve an Akamai bot management challenge.
   */
  async solveAkamai(
    request: AkamaiRequest
  ): Promise<SolveResponse<AkamaiSolution>> {
    const body: Record<string, unknown> = {
      task_type: "akamai",
      proxy: request.proxy,
      target_url: request.targetUrl,
      akamai_js_url: request.akamaiJsUrl,
    };
    if (request.pageFp) body.page_fp = request.pageFp;

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: {
        cookies_dict: {
          _abck: string;
          bm_sz: string;
          Country?: string;
          UsrLocale?: string;
        };
        ua: string;
      };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/akamai", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        cookies: {
          abck: data.solution.cookies_dict._abck,
          bmSz: data.solution.cookies_dict.bm_sz,
          country: data.solution.cookies_dict.Country,
          usrLocale: data.solution.cookies_dict.UsrLocale,
        },
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Vercel bot protection challenge.
   */
  async solveVercel(
    request: VercelRequest
  ): Promise<SolveResponse<VercelSolution>> {
    const body = {
      task_type: "vercel",
      proxy: request.proxy,
      target_url: request.targetUrl,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { _vcrcs: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/vercel", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        vcrcs: data.solution._vcrcs,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Shape antibot challenge (v1).
   */
  async solveShape(
    request: ShapeRequest
  ): Promise<SolveResponse<ShapeSolution>> {
    const body = {
      task_type: "shape",
      proxy: request.proxy,
      target_url: request.targetUrl,
      target_api: request.targetApi,
      shape_js_url: request.shapeJsUrl,
      title: request.title,
      method: request.method,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: Record<string, string>;
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/shape", body);

    // Shape returns dynamic headers, extract User-Agent separately
    const { "User-Agent": userAgent, ...headers } = data.solution;

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        headers,
        userAgent: userAgent || "",
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Shape antibot challenge using the v2 API with TLS fingerprinting.
   */
  async solveShapeV2(
    request: ShapeV2Request
  ): Promise<SolveResponse<ShapeV2Solution>> {
    const metadata: Record<string, unknown> = {
      proxy: request.proxy,
    };
    if (request.pkey) metadata.pkey = request.pkey;
    if (request.scriptUrl) metadata.script_url = request.scriptUrl;
    if (request.request) metadata.request = request.request;
    if (request.country) metadata.country = request.country;
    if (request.timeout) metadata.timeout = request.timeout;

    const body = {
      url: request.url,
      metadata,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: {
        headers?: Record<string, string>;
        [key: string]: unknown;
      };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/shape-v2", body);

    const { headers = {}, ...extra } = data.solution;

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        headers,
        extra: Object.keys(extra).length > 0 ? extra : undefined,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Cloudflare Turnstile challenge.
   */
  async solveTurnstile(
    request: TurnstileRequest
  ): Promise<SolveResponse<TurnstileSolution>> {
    const body = {
      task_type: "turnstile",
      proxy: request.proxy,
      target_url: request.targetUrl,
      site_key: request.siteKey,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { token: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/turnstile", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        token: data.solution.token,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a PerimeterX Invisible challenge.
   */
  async solvePerimeterX(
    request: PerimeterXRequest
  ): Promise<SolveResponse<PerimeterXSolution>> {
    const body = {
      task_type: "perimeterx_invisible",
      proxy: request.proxy,
      target_url: request.targetUrl,
      perimeterx_js_url: request.perimeterxJsUrl,
      pxAppId: request.pxAppId,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: {
        perimeterx_cookies: {
          _px3: string;
          _pxde: string;
          _pxvid: string;
          pxcts: string;
        };
        ua: string;
      };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/perimeterx-invisible", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        cookies: {
          px3: data.solution.perimeterx_cookies._px3,
          pxde: data.solution.perimeterx_cookies._pxde,
          pxvid: data.solution.perimeterx_cookies._pxvid,
          pxcts: data.solution.perimeterx_cookies.pxcts,
        },
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Cloudflare WAF challenge.
   */
  async solveCloudflareWAF(
    request: CloudflareWAFRequest
  ): Promise<SolveResponse<CloudflareWAFSolution>> {
    const body = {
      task_type: "cloudflare_waf",
      proxy: request.proxy,
      target_url: request.targetUrl,
      target_method: request.targetMethod ?? "GET",
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: {
        cookies: {
          cf_clearance: string;
        };
        ua: string;
      };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/cloudflare-waf", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        cookies: {
          cfClearance: data.solution.cookies.cf_clearance,
        },
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Datadome Slider CAPTCHA challenge.
   */
  async solveDatadomeSlider(
    request: DatadomeSliderRequest
  ): Promise<SolveResponse<DatadomeSliderSolution>> {
    const body = {
      task_type: "datadome-slider",
      proxy: request.proxy,
      target_url: request.targetUrl,
      target_method: request.targetMethod ?? "GET",
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { datadome: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/datadome-slider", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        datadome: data.solution.datadome,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a CaptchaFox challenge.
   */
  async solveCaptchaFox(
    request: CaptchaFoxRequest
  ): Promise<SolveResponse<CaptchaFoxSolution>> {
    const body = {
      task_type: "captchafox",
      proxy: request.proxy,
      target_url: request.targetUrl,
      site_key: request.siteKey,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { cookie: { bm_s: string; bm_sc: string }; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/captchafox", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        cookie: {
          bmS: data.solution.cookie.bm_s,
          bmSc: data.solution.cookie.bm_sc,
        },
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Castle challenge.
   */
  async solveCastle(
    request: CastleRequest
  ): Promise<SolveResponse<CastleSolution>> {
    const body = {
      task_type: "castle",
      proxy: request.proxy,
      target_url: request.targetUrl,
      config_json: {
        avoidCookies: request.configJson.avoidCookies,
        pk: request.configJson.pk,
        wUrl: request.configJson.wUrl,
        swUrl: request.configJson.swUrl,
      },
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { token: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/castle", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        token: data.solution.token,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve an Incapsula Reese84 challenge.
   */
  async solveReese84(
    request: Reese84Request
  ): Promise<SolveResponse<Reese84Solution>> {
    const body = {
      task_type: "reese84",
      proxy: request.proxy,
      reese84_js_url: request.reese84JsUrl,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { reese84: string; user_agent: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/reese84", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        reese84: data.solution.reese84,
        userAgent: data.solution.user_agent,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Forter challenge.
   */
  async solveForter(
    request: ForterRequest
  ): Promise<SolveResponse<ForterSolution>> {
    const body = {
      task_type: "forter",
      proxy: request.proxy,
      target_url: request.targetUrl,
      forter_js_url: request.forterJsUrl,
      site_id: request.siteId,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { token: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/forter", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        token: data.solution.token,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve a Funcaptcha (Arkose Labs) challenge.
   */
  async solveFuncaptcha(
    request: FuncaptchaRequest
  ): Promise<SolveResponse<FuncaptchaSolution>> {
    const body = {
      task_type: "funcaptcha",
      proxy: request.proxy,
      target_url: request.targetUrl,
      custom_api_host: request.customApiHost,
      public_key: request.publicKey,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { token: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/funcaptcha", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        token: data.solution.token,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }

  /**
   * Solve an Akamai SBSD challenge.
   */
  async solveSBSD(request: SBSDRequest): Promise<SolveResponse<SBSDSolution>> {
    const body = {
      task_type: "sbsd",
      proxy: request.proxy,
      target_url: request.targetUrl,
      target_method: request.targetMethod,
    };

    const data = await this.request<{
      success: boolean;
      taskId: string;
      service: string;
      solution: { bm_s: string; bm_sc: string; ua: string };
      cost: number;
      solveTime: number;
    }>("POST", "/v1/solve/sbsd", body);

    return {
      success: data.success,
      taskId: data.taskId,
      service: data.service,
      solution: {
        bmS: data.solution.bm_s,
        bmSc: data.solution.bm_sc,
        userAgent: data.solution.ua,
      },
      cost: data.cost,
      solveTime: data.solveTime,
    };
  }
}
