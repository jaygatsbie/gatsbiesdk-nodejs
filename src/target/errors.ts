/** Base error class for Target SDK errors. */
export class TargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TargetError";
  }
}

/** Error response structure from the Target API. */
export interface APIErrorDetails {
  message: string;
  status?: number;
  details?: string;
  suggestion?: string;
  code?: string;
  httpStatus: number;
}

/** Error returned by the Target API. */
export class APIError extends TargetError {
  readonly message: string;
  readonly status?: number;
  readonly details?: string;
  readonly suggestion?: string;
  readonly code?: string;
  readonly httpStatus: number;

  constructor(params: APIErrorDetails) {
    super(params.message);
    this.name = "APIError";
    this.message = params.message;
    this.status = params.status;
    this.details = params.details;
    this.suggestion = params.suggestion;
    this.code = params.code;
    this.httpStatus = params.httpStatus;
  }

  /** Returns true if the error is an authentication error. */
  isUnauthorized(): boolean {
    return this.httpStatus === 401;
  }

  /** Returns true if the requested resource was not found. */
  isNotFound(): boolean {
    return this.httpStatus === 404;
  }

  /** Returns true if the error is due to an invalid request. */
  isInvalidRequest(): boolean {
    return this.httpStatus === 400;
  }

  /** Returns true if the error is from an upstream service. */
  isUpstreamError(): boolean {
    return this.httpStatus === 502;
  }

  /** Returns true if the error is an internal server error. */
  isInternalError(): boolean {
    return this.httpStatus === 500;
  }

  /** Returns true if the item is not available for the selected fulfillment method. */
  isInventoryUnavailable(): boolean {
    return this.code === "INVENTORY_UNAVAILABLE" || this.httpStatus === 424;
  }
}

/** Error during HTTP request (network, timeout, etc.). */
export class RequestError extends TargetError {
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "RequestError";
    this.cause = cause;
  }
}
