import { Client } from "../src/target";

async function main() {
  // Get API key from environment
  const apiKey = process.env.GATSBIE_API_KEY;
  if (!apiKey) {
    console.error("GATSBIE_API_KEY environment variable is required");
    process.exit(1);
  }

  // Create client
  const client = new Client(apiKey);

  // Health check
  console.log("=== Health Check ===");
  try {
    const health = await client.health();
    console.log("Status:", health.status);
  } catch (err) {
    console.error("Health check failed:", err);
  }

  // Ping (get quota info)
  console.log("\n=== Ping ===");
  try {
    const ping = await client.ping();
    console.log("Message:", ping.message);
    if (ping.quotaUsed !== undefined) {
      console.log(`Quota: ${ping.quotaUsed} / ${ping.quotaLimit}`);
    }
  } catch (err) {
    console.error("Ping failed:", err);
  }

  // Find nearby stores
  console.log("\n=== Nearby Stores ===");
  try {
    const stores = await client.getNearbyStores({
      lat: 40.7147,
      lng: -74.0112,
      limit: 5,
    });
    for (const store of stores) {
      console.log(
        `- ${store.name} (${store.city}, ${store.state}) - ${store.distanceMiles.toFixed(2)} miles`
      );
    }
  } catch (err) {
    console.error("Failed to get nearby stores:", err);
  }

  // Get product details (requires proxy)
  const proxy = process.env.PROXY_URL;
  if (proxy) {
    console.log("\n=== Product Details ===");
    try {
      const product = await client.getProduct({
        tcin: "86777236",
        proxy,
      });
      console.log("Title:", product.title);
      console.log("Price:", product.currentPrice);
      console.log("In Stock:", product.inStock);
      if (product.onSale) {
        console.log(
          `On Sale! Save ${product.savingsAmount} (${product.savingsPercent}% off)`
        );
      }
      if (product.variations && product.variations.length > 0) {
        console.log("Variations:", product.variations.length);
        for (const v of product.variations) {
          console.log(`  - ${v.name}: ${v.value} (${v.currentPrice})`);
        }
      }
    } catch (err) {
      console.error("Failed to get product:", err);
    }
  }

  // Add to cart (requires proxy and access token)
  const accessToken = process.env.TARGET_ACCESS_TOKEN;
  if (proxy && accessToken) {
    console.log("\n=== Add to Cart ===");
    try {
      const cartResp = await client.addToCart({
        tcin: "94716087",
        quantity: 1,
        accessToken,
        proxy,
      });
      console.log("Success:", cartResp.success);
      console.log("Cart ID:", cartResp.cartId);
      console.log("Items in Cart:", cartResp.totalItemsInCart);
      console.log("Item:", cartResp.itemAdded.title);
      console.log(`Total: $${cartResp.pricing.total.toFixed(2)}`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  }
}

main().catch(console.error);
