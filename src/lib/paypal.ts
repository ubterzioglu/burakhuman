import type { Order, Product } from "./types";

const clientId = process.env.PAYPAL_CLIENT_ID ?? "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? "";
const paypalEnv = (process.env.PAYPAL_ENV ?? "sandbox").toLowerCase();
export const paypalWebhookId = process.env.PAYPAL_WEBHOOK_ID ?? "";

const baseUrl = paypalEnv === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export function isPaypalConfigured() {
  return Boolean(clientId && clientSecret);
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("PayPal auth failed");
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function createPaypalOrder(order: Order, product: Product): Promise<{ id: string }> {
  const token = await getAccessToken();
  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: order.guid,
          description: product.title,
          amount: {
            currency_code: product.currency,
            value: (product.price_cents / 100).toFixed(2),
          },
        },
      ],
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("PayPal order creation failed");
  const data = (await response.json()) as { id: string };
  return data;
}

export type PaypalCaptureResult = {
  status: string;
  captureId: string | null;
  currency: string | null;
  value: string | null;
  customId: string | null;
};

export async function capturePaypalOrder(paypalOrderId: string): Promise<PaypalCaptureResult> {
  const token = await getAccessToken();
  const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("PayPal capture failed");
  const data = await response.json();
  const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    status: String(data?.status ?? ""),
    captureId: capture?.id ?? null,
    currency: capture?.amount?.currency_code ?? null,
    value: capture?.amount?.value ?? null,
    customId: capture?.custom_id ?? data?.purchase_units?.[0]?.custom_id ?? null,
  };
}

export async function verifyWebhookSignature(
  headers: Headers,
  rawBody: string,
): Promise<boolean> {
  if (!paypalWebhookId) return false;
  const token = await getAccessToken();
  const response = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: paypalWebhookId,
      webhook_event: JSON.parse(rawBody),
    }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const data = (await response.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}
