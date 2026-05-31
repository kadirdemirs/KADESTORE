import crypto from "crypto";

export interface ShopierPaymentParams {
  orderId: string;
  productName: string;
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  totalPrice: number;
  callbackUrl: string;
}

export function generateShopierForm(params: ShopierPaymentParams): {
  actionUrl: string;
  fields: Record<string, string>;
} {
  const apiKey = process.env.SHOPIER_API_KEY!;
  const apiSecret = process.env.SHOPIER_API_SECRET!;
  const websiteIndex = process.env.SHOPIER_WEBSITE_INDEX || "1";
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const randomNr = Math.floor(Math.random() * 9000000000) + 1000000000;
  const currency = "0"; // 0 = TRY
  const totalStr = params.totalPrice.toFixed(2);

  // HMAC-SHA256 imzası: random_nr + platform_order_id + total + currency
  const signatureData = `${randomNr}${params.orderId}${totalStr}${currency}`;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(signatureData)
    .digest("base64");

  const fields: Record<string, string> = {
    API_key: apiKey,
    website_index: websiteIndex,
    platform_order_id: params.orderId,
    product_name: params.productName.slice(0, 100),
    product_type: "1", // dijital ürün
    buyer_name: params.buyerName,
    buyer_surname: params.buyerSurname,
    buyer_email: params.buyerEmail,
    buyer_account_age: "0",
    buyer_id_nr: "0",
    billing_address: "Türkiye",
    billing_city: "Istanbul",
    billing_country: "TR",
    billing_postcode: "34000",
    shipping_address: "Türkiye",
    shipping_city: "Istanbul",
    shipping_country: "TR",
    shipping_postcode: "34000",
    total_order_value: totalStr,
    currency: currency,
    current_currency_value: "1",
    random_nr: String(randomNr),
    signature: signature,
    callback: `${appUrl}/api/payment/callback`,
    return_url: `${appUrl}/payment/success?order=${params.orderId}`,
    cancel_url: `${appUrl}/payment/cancel?order=${params.orderId}`,
  };

  return {
    actionUrl: "https://www.shopier.com/ShowProduct/api_pay4.php",
    fields,
  };
}

// Shopier REST API (Bearer token ile)
const SHOPIER_API_BASE = "https://api.shopier.com/v1";

export async function shopierRequest(path: string, options?: RequestInit) {
  const token = process.env.SHOPIER_API_TOKEN;
  const res = await fetch(`${SHOPIER_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Shopier API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getShopierOrder(orderId: string) {
  return shopierRequest(`/orders/${orderId}`);
}

export async function getShopierOrders(page = 1) {
  return shopierRequest(`/orders?page=${page}&per_page=50`);
}

export async function getShopierShopInfo() {
  return shopierRequest("/shop");
}

export function verifyShopierCallback(params: {
  platform_order_id: string;
  status: string;
  payment_id: string;
  random_nr: string;
  signature?: string;
}): boolean {
  const apiSecret = process.env.SHOPIER_API_SECRET!;
  if (!params.signature) return false;
  const data = `${params.random_nr}${params.platform_order_id}${params.payment_id}${params.status}`;
  const expected = crypto
    .createHmac("sha256", apiSecret)
    .update(data)
    .digest("base64");
  return expected === params.signature;
}
