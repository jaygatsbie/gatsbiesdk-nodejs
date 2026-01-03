import { APIError, RequestError } from "./errors";
import type {
  AddToCartRequest,
  AddToCartResponse,
  ClientOptions,
  GetProductRequest,
  HealthResponse,
  NearbyStoresRequest,
  PingResponse,
  ProductResponse,
  StoreResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://target.gatsbie.io";
const DEFAULT_TIMEOUT = 120000;

/**
 * Target API client.
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
export class Client {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Create a new Target API client.
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
        throw new APIError({
          message: (data.error as string) || "Unknown error",
          status: data.status as number | undefined,
          details: data.details as string | undefined,
          suggestion: data.suggestion as string | undefined,
          code: data.code as string | undefined,
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
   * Ping the API and get quota information.
   */
  async ping(): Promise<PingResponse> {
    const data = await this.request<{
      message: string;
      quota_used?: number;
      quota_limit?: number;
    }>("GET", "/api/v1/ping");

    return {
      message: data.message,
      quotaUsed: data.quota_used,
      quotaLimit: data.quota_limit,
    };
  }

  /**
   * Find nearby Target stores.
   *
   * @param request - The nearby stores request parameters.
   * @returns List of nearby stores sorted by distance.
   */
  async getNearbyStores(request: NearbyStoresRequest): Promise<StoreResponse[]> {
    const params = new URLSearchParams();
    params.set("lat", request.lat.toString());
    params.set("lng", request.lng.toString());

    if (request.limit !== undefined) {
      params.set("limit", request.limit.toString());
    }
    if (request.radius !== undefined) {
      params.set("radius", request.radius.toString());
    }

    const data = await this.request<
      Array<{
        id: number;
        name: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        latitude: number;
        longitude: number;
        driveUpEnabled: boolean;
        distanceMiles: number;
      }>
    >("GET", `/api/v1/stores/nearby?${params.toString()}`);

    return data.map((store) => ({
      id: store.id,
      name: store.name,
      address: store.address,
      city: store.city,
      state: store.state,
      postalCode: store.postalCode,
      latitude: store.latitude,
      longitude: store.longitude,
      driveUpEnabled: store.driveUpEnabled,
      distanceMiles: store.distanceMiles,
    }));
  }

  /**
   * Get detailed product information.
   *
   * @param request - The product request parameters.
   * @returns Product details including pricing, availability, and variations.
   */
  async getProduct(request: GetProductRequest): Promise<ProductResponse> {
    if (!request.tcin) {
      throw new APIError({
        message: "tcin is required",
        httpStatus: 400,
      });
    }
    if (!request.proxy) {
      throw new APIError({
        message: "proxy is required",
        httpStatus: 400,
      });
    }

    const params = new URLSearchParams();
    params.set("proxy", request.proxy);
    if (request.storeId) {
      params.set("store_id", request.storeId);
    }

    const data = await this.request<{
      tcin: string;
      title: string;
      current_price: string;
      regular_price?: string;
      on_sale: boolean;
      savings_amount?: string;
      savings_percent?: number;
      primary_image_url: string;
      in_stock: boolean;
      available_for_shipping: boolean;
      available_for_pickup: boolean;
      free_shipping_available: boolean;
      rating_average?: number;
      rating_count?: number;
      review_count?: number;
      variations?: Array<{
        tcin: string;
        name: string;
        value: string;
        swatch_image_url?: string;
        primary_image_url: string;
        current_price: string;
        in_stock: boolean;
        available_for_shipping: boolean;
        available_for_pickup: boolean;
      }>;
    }>("GET", `/api/v1/products/${request.tcin}?${params.toString()}`);

    return {
      tcin: data.tcin,
      title: data.title,
      currentPrice: data.current_price,
      regularPrice: data.regular_price,
      onSale: data.on_sale,
      savingsAmount: data.savings_amount,
      savingsPercent: data.savings_percent,
      primaryImageUrl: data.primary_image_url,
      inStock: data.in_stock,
      availableForShipping: data.available_for_shipping,
      availableForPickup: data.available_for_pickup,
      freeShippingAvailable: data.free_shipping_available,
      ratingAverage: data.rating_average,
      ratingCount: data.rating_count,
      reviewCount: data.review_count,
      variations: data.variations?.map((v) => ({
        tcin: v.tcin,
        name: v.name,
        value: v.value,
        swatchImageUrl: v.swatch_image_url,
        primaryImageUrl: v.primary_image_url,
        currentPrice: v.current_price,
        inStock: v.in_stock,
        availableForShipping: v.available_for_shipping,
        availableForPickup: v.available_for_pickup,
      })),
    };
  }

  /**
   * Add an item to the Target shopping cart.
   *
   * @param request - The add to cart request parameters.
   * @returns Cart update response with item details and pricing.
   */
  async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
    if (!request.tcin) {
      throw new APIError({
        message: "tcin is required",
        httpStatus: 400,
      });
    }
    if (request.quantity < 1) {
      throw new APIError({
        message: "quantity must be at least 1",
        httpStatus: 400,
      });
    }
    if (!request.accessToken) {
      throw new APIError({
        message: "accessToken is required",
        httpStatus: 400,
      });
    }
    if (!request.proxy) {
      throw new APIError({
        message: "proxy is required",
        httpStatus: 400,
      });
    }

    // Validate fulfillment type requires storeId
    if (
      (request.fulfillmentType === "CURBSIDE" ||
        request.fulfillmentType === "STORE_PICKUP") &&
      !request.storeId
    ) {
      throw new APIError({
        message:
          "storeId is required when fulfillmentType is CURBSIDE or STORE_PICKUP",
        httpStatus: 400,
      });
    }

    const body: Record<string, unknown> = {
      tcin: request.tcin,
      quantity: request.quantity,
      access_token: request.accessToken,
      proxy: request.proxy,
    };
    if (request.fulfillmentType) {
      body.fulfillment_type = request.fulfillmentType;
    }
    if (request.storeId) {
      body.store_id = request.storeId;
    }

    const data = await this.request<{
      success: boolean;
      message?: string;
      cart_id: string;
      total_items_in_cart: number;
      item_added: {
        tcin: string;
        title: string;
        image_url: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
      };
      fulfillment: {
        type: "SHIP" | "PICKUP";
        store_name?: string;
        estimated_date: string;
        pickup_hours?: number;
      };
      pricing: {
        item_total: number;
        shipping: number;
        tax: number;
        total: number;
      };
      return_policy?: {
        days: number;
        days_with_circle: number;
      };
    }>("POST", "/api/v1/cart/items", body);

    return {
      success: data.success,
      message: data.message,
      cartId: data.cart_id,
      totalItemsInCart: data.total_items_in_cart,
      itemAdded: {
        tcin: data.item_added.tcin,
        title: data.item_added.title,
        imageUrl: data.item_added.image_url,
        quantity: data.item_added.quantity,
        unitPrice: data.item_added.unit_price,
        subtotal: data.item_added.subtotal,
      },
      fulfillment: {
        type: data.fulfillment.type,
        storeName: data.fulfillment.store_name,
        estimatedDate: data.fulfillment.estimated_date,
        pickupHours: data.fulfillment.pickup_hours,
      },
      pricing: {
        itemTotal: data.pricing.item_total,
        shipping: data.pricing.shipping,
        tax: data.pricing.tax,
        total: data.pricing.total,
      },
      returnPolicy: data.return_policy
        ? {
            days: data.return_policy.days,
            daysWithCircle: data.return_policy.days_with_circle,
          }
        : undefined,
    };
  }
}
