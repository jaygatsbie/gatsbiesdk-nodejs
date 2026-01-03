/**
 * Target SDK - Official Node.js SDK for the Target API.
 *
 * @example
 * ```typescript
 * import { Client } from "gatsbie/target";
 *
 * const client = new Client("gats_your_api_key");
 *
 * // Find nearby stores
 * const stores = await client.getNearbyStores({
 *   lat: 40.7147,
 *   lng: -74.0112,
 *   limit: 5,
 * });
 *
 * // Get product details
 * const product = await client.getProduct({
 *   tcin: "86777236",
 *   proxy: "http://user:pass@host:port",
 * });
 *
 * console.log(product.title, product.currentPrice);
 * ```
 */

export { Client } from "./client";
export { APIError, RequestError, TargetError } from "./errors";
export type {
  // Response types
  HealthResponse,
  PingResponse,
  StoreResponse,
  ProductResponse,
  ProductVariation,
  AddToCartResponse,
  AddedItemSummary,
  FulfillmentSummary,
  PricingSummary,
  ReturnPolicySummary,
  // Request types
  NearbyStoresRequest,
  GetProductRequest,
  AddToCartRequest,
  FulfillmentType,
  // Options
  ClientOptions,
} from "./types";
