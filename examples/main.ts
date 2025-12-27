/**
 * Example usage of the Gatsbie SDK.
 *
 * Run with: npx tsx examples/main.ts
 */

import { APIError, Client } from "../src";

async function main() {
  // Get API key from environment
  const apiKey = process.env.GATSBIE_API_KEY;
  if (!apiKey) {
    console.error("GATSBIE_API_KEY environment variable is required");
    process.exit(1);
  }

  // Create client with default options
  const client = new Client(apiKey);

  // Or with custom options:
  // const client = new Client(apiKey, {
  //   timeout: 60000,
  //   baseUrl: "https://custom.api.url",
  // });

  // Check API health
  const health = await client.health();
  console.log(`API Status: ${health.status}\n`);

  // Example: Solve Turnstile challenge
  await solveTurnstileExample(client);

  // Example: Solve Datadome challenge
  // await solveDatadomeExample(client);

  // Example: Solve reCAPTCHA v3 challenge
  // await solveRecaptchaV3Example(client);

  // Example: Solve Akamai challenge
  // await solveAkamaiExample(client);
}

async function solveTurnstileExample(client: Client) {
  console.log("Solving Turnstile challenge...");

  try {
    const resp = await client.solveTurnstile({
      proxy: "http://user:pass@proxy.example.com:8080",
      targetUrl: "https://example.com/protected-page",
      siteKey: "0x4AAAAAAABS7TtLxsNa7Z2e",
    });

    console.log(`Success! Task ID: ${resp.taskId}`);
    console.log(`Token: ${resp.solution.token.substring(0, 50)}...`);
    console.log(`User-Agent: ${resp.solution.userAgent}`);
    console.log(`Cost: ${resp.cost.toFixed(4)} credits`);
    console.log(`Solve Time: ${resp.solveTime.toFixed(2)} ms\n`);
  } catch (err) {
    handleError(err);
  }
}

async function solveDatadomeExample(client: Client) {
  console.log("Solving Datadome device check...");

  try {
    const resp = await client.solveDatadome({
      proxy: "http://user:pass@proxy.example.com:8080",
      targetUrl: "https://www.cma-cgm.com/",
      targetMethod: "GET",
    });

    console.log(`Success! Task ID: ${resp.taskId}`);
    console.log(`Datadome Cookie: ${resp.solution.datadome.substring(0, 50)}...`);
    console.log(`User-Agent: ${resp.solution.userAgent}`);
    console.log(`Cost: ${resp.cost.toFixed(4)} credits`);
    console.log(`Solve Time: ${resp.solveTime.toFixed(2)} ms\n`);
  } catch (err) {
    handleError(err);
  }
}

async function solveRecaptchaV3Example(client: Client) {
  console.log("Solving reCAPTCHA v3...");

  try {
    const resp = await client.solveRecaptchaV3({
      proxy: "http://user:pass@proxy.example.com:8080",
      targetUrl: "https://2captcha.com/demo/recaptcha-v3",
      siteKey: "6Lcyqq8oAAAAAJE7eVJ3aZp_hnJcI6LgGdYD8lge",
      action: "demo_action",
      title: "Google reCAPTCHA V3 demo: Sample Form with Google reCAPTCHA V3",
      enterprise: false,
    });

    console.log(`Success! Task ID: ${resp.taskId}`);
    console.log(`Token: ${resp.solution.token.substring(0, 50)}...`);
    console.log(`User-Agent: ${resp.solution.userAgent}`);
    console.log(`Cost: ${resp.cost.toFixed(4)} credits`);
    console.log(`Solve Time: ${resp.solveTime.toFixed(2)} ms\n`);
  } catch (err) {
    handleError(err);
  }
}

async function solveAkamaiExample(client: Client) {
  console.log("Solving Akamai challenge...");

  try {
    const resp = await client.solveAkamai({
      proxy: "http://user:pass@proxy.example.com:8080",
      targetUrl: "https://shop.lululemon.com/",
      akamaiJsUrl:
        "https://shop.lululemon.com/WGlx/lc_w/w/vez/w0HNXw/EmubktLXh3Npr6Nab5/TXUGYQ/Lh9aC2xK/H34",
    });

    console.log(`Success! Task ID: ${resp.taskId}`);
    console.log(`_abck: ${resp.solution.abck.substring(0, 50)}...`);
    console.log(`bm_sz: ${resp.solution.bmSz.substring(0, 50)}...`);
    console.log(`User-Agent: ${resp.solution.userAgent}`);
    console.log(`Cost: ${resp.cost.toFixed(4)} credits`);
    console.log(`Solve Time: ${resp.solveTime.toFixed(2)} ms\n`);
  } catch (err) {
    handleError(err);
  }
}

function handleError(err: unknown) {
  if (err instanceof APIError) {
    console.log(`API Error [${err.code}]: ${err.message}`);
    if (err.details) {
      console.log(`Details: ${err.details}`);
    }

    // Handle specific error types
    if (err.isAuthError()) {
      console.log("Check your API key");
    } else if (err.isInsufficientCredits()) {
      console.log("Please add more credits to your account");
    } else if (err.isSolveFailed()) {
      console.log("The captcha could not be solved, try again");
    }
  } else if (err instanceof Error) {
    console.log(`Error: ${err.message}`);
  }
}

main().catch(console.error);
