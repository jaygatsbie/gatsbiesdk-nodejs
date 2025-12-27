/**
 * Error codes returned by the Gatsbie API.
 */
export const ErrorCode = {
  AUTH_FAILED: "AUTH_FAILED",
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  INVALID_REQUEST: "INVALID_REQUEST",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
  SOLVE_FAILED: "SOLVE_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base error class for Gatsbie SDK errors.
 */
export class GatsbieError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GatsbieError";
    Object.setPrototypeOf(this, GatsbieError.prototype);
  }
}

/**
 * Error thrown when the Gatsbie API returns an error response.
 */
export class APIError extends GatsbieError {
  readonly code: string;
  readonly details?: string;
  readonly timestamp?: number;
  readonly httpStatus?: number;

  constructor(options: {
    code: string;
    message: string;
    details?: string;
    timestamp?: number;
    httpStatus?: number;
  }) {
    const msg = options.details
      ? `gatsbie: ${options.code}: ${options.message} (${options.details})`
      : `gatsbie: ${options.code}: ${options.message}`;
    super(msg);
    this.name = "APIError";
    this.code = options.code;
    this.details = options.details;
    this.timestamp = options.timestamp;
    this.httpStatus = options.httpStatus;
    Object.setPrototypeOf(this, APIError.prototype);
  }

  /** Check if this is an authentication error. */
  isAuthError(): boolean {
    return this.code === ErrorCode.AUTH_FAILED;
  }

  /** Check if this error is due to insufficient credits. */
  isInsufficientCredits(): boolean {
    return this.code === ErrorCode.INSUFFICIENT_CREDITS;
  }

  /** Check if this error is due to an invalid request. */
  isInvalidRequest(): boolean {
    return this.code === ErrorCode.INVALID_REQUEST;
  }

  /** Check if this error is from an upstream service. */
  isUpstreamError(): boolean {
    return this.code === ErrorCode.UPSTREAM_ERROR;
  }

  /** Check if the captcha solving failed. */
  isSolveFailed(): boolean {
    return this.code === ErrorCode.SOLVE_FAILED;
  }

  /** Check if this is an internal server error. */
  isInternalError(): boolean {
    return this.code === ErrorCode.INTERNAL_ERROR;
  }
}

/**
 * Error thrown when a request fails (network error, timeout, etc.).
 */
export class RequestError extends GatsbieError {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "RequestError";
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
