// ============================================================================
// Response Types
// ============================================================================

/** Response from the health check endpoint. */
export interface HealthResponse {
  status: string;
}

/** Response from the ping endpoint. */
export interface PingResponse {
  message: string;
  quotaUsed?: number;
  quotaLimit?: number;
}

/** Target store with distance information. */
export interface StoreResponse {
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
}

/** Product variation information (color, size, etc.). */
export interface ProductVariation {
  tcin: string;
  name: string;
  value: string;
  swatchImageUrl?: string;
  primaryImageUrl: string;
  currentPrice: string;
  inStock: boolean;
  availableForShipping: boolean;
  availableForPickup: boolean;
}

/** Product details response. */
export interface ProductResponse {
  tcin: string;
  title: string;
  currentPrice: string;
  regularPrice?: string;
  onSale: boolean;
  savingsAmount?: string;
  savingsPercent?: number;
  primaryImageUrl: string;
  inStock: boolean;
  availableForShipping: boolean;
  availableForPickup: boolean;
  freeShippingAvailable: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  reviewCount?: number;
  variations?: ProductVariation[];
}

/** Summary of item added to cart. */
export interface AddedItemSummary {
  tcin: string;
  title: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** Fulfillment details for cart items. */
export interface FulfillmentSummary {
  type: "SHIP" | "PICKUP";
  storeName?: string;
  estimatedDate: string;
  pickupHours?: number;
}

/** Price breakdown for cart items. */
export interface PricingSummary {
  itemTotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/** Return policy information. */
export interface ReturnPolicySummary {
  days: number;
  daysWithCircle: number;
}

/** Response after adding item to cart. */
export interface AddToCartResponse {
  success: boolean;
  message?: string;
  cartId: string;
  totalItemsInCart: number;
  itemAdded: AddedItemSummary;
  fulfillment: FulfillmentSummary;
  pricing: PricingSummary;
  returnPolicy?: ReturnPolicySummary;
}

// ============================================================================
// Request Types
// ============================================================================

/** Request for finding nearby stores. */
export interface NearbyStoresRequest {
  lat: number;
  lng: number;
  /** Maximum number of stores to return (default: 10). */
  limit?: number;
  /** Maximum search radius in miles (default: 50.0). */
  radius?: number;
}

/** Request for getting product details. */
export interface GetProductRequest {
  /** Target product ID (TCIN). */
  tcin: string;
  /** Store ID for pricing and availability. Defaults to "3229" (Tribeca, NY). */
  storeId?: string;
  /** Proxy URL for TLS fingerprinting. Format: http://user:pass@host:port */
  proxy: string;
}

/** Fulfillment type for cart items. */
export type FulfillmentType = "SHIP" | "CURBSIDE" | "STORE_PICKUP";

/** Request for adding item to cart. */
export interface AddToCartRequest {
  /** Target product ID (TCIN). */
  tcin: string;
  /** Number of items to add. */
  quantity: number;
  /** Valid Target user authentication token (JWT). */
  accessToken: string;
  /** Proxy URL for TLS fingerprinting. Format: http://user:pass@host:port */
  proxy: string;
  /** Fulfillment method. Defaults to "SHIP". */
  fulfillmentType?: FulfillmentType;
  /** Store ID (required for CURBSIDE or STORE_PICKUP). */
  storeId?: string;
}

// ============================================================================
// Client Options
// ============================================================================

/** Options for configuring the Target client. */
export interface ClientOptions {
  /** Custom base URL for the API. */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 120000). */
  timeout?: number;
}
