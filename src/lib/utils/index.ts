import fetch from 'node-fetch';
import crypto from 'crypto';

import { STORE, API_VERSION, ACCESS_TOKEN } from '../const';

export * from './combines-with-shipping';

type ShopifyResponse<T> = {
  data: T;
};

export async function shopifyAuthenticatedFetch<T>(
  query: string,
  variables?: object
): Promise<ShopifyResponse<T>> {
  try {
    const endpoint = `https://${STORE}.myshopify.com/admin/api/${API_VERSION}/graphql.json`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    return json as ShopifyResponse<T>;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch from Shopify');
  }
}

export async function verifyWebhook(signature: string, rawBody: string) {
  // @ts-ignore
  const key = process.env.WEBHOOK_SECRET;
  const hmac = signature;
  const hash = crypto
    .createHmac('sha256', key)
    .update(rawBody, 'utf8') // removed hex
    .digest('base64');
  if (hmac === hash) {
    console.log('+++++++++++++++++ REQUEST VERIFIED +++++++++++++++++>');
    return true;
  } else {
    console.log('+++++++++++++++++ ERROR - FORBIDDEN +++++++++++++++++>');
    return false;
  }
}

export function createErrorResponse(message: string, statusCode: number) {
  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
}

export function createUnauthorizedResponse(message: string) {
  return createErrorResponse(message, 401);
}

export function createSuccessResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
}
