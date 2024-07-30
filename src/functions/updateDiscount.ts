import {
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
} from 'aws-lambda';

import type { DiscountNodeQuery } from '../lib/types/admin.generated';
import { discountNode } from '../lib/handlers';
import {
  createErrorResponse,
  createUnauthorizedResponse,
  createSuccessResponse,
  verifyWebhook,
  shopifyAuthenticatedFetch,
  updateAutomaticAppDiscount,
  updateAutomaticBasicDiscount,
  updateAutomaticBxgyDiscount,
  updateAutomaticFreeShippingDiscount,
  updateDiscountCodeBasic,
  updateDiscountCodeBxgy,
} from '../lib/utils';

type WebhookDiscountBody = {
  admin_graphql_api_id: string;
  title: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SCHEDULED' | 'DISABLED';
  created_at: string;
  updated_at: string;
};

const getDiscount = async (id: string) => {
  const response = await shopifyAuthenticatedFetch<DiscountNodeQuery>(
    discountNode,
    { id }
  );

  console.log('DISCOUNT NODE RESPONSE', JSON.stringify(response, null, 2));

  if (response?.data?.discountNode) {
    return response.data.discountNode;
  }
  return null;
};

const updateDiscount = async (body: WebhookDiscountBody) => {
  const { admin_graphql_api_id } = body;

  console.log('Getting discount', admin_graphql_api_id);
  // get discount node
  const response = await getDiscount(admin_graphql_api_id);

  if (!response) {
    console.log('Discount not found, therefore not updating');
    return false;
  }

  const { discount } = response;
  console.log('Discount found', JSON.stringify(discount, null, 2));

  const { type } = discount;

  if (type === 'DiscountAutomaticApp') {
    // discount automatic app
    await updateAutomaticAppDiscount(admin_graphql_api_id);
  } else if (type === 'DiscountAutomaticBasic') {
    // discount automatic basic
    await updateAutomaticBasicDiscount(admin_graphql_api_id);
  } else if (type === 'DiscountAutomaticBxgy') {
    // discount automatic bxgy
    await updateAutomaticBxgyDiscount(admin_graphql_api_id);
  } else if (type === 'DiscountAutomaticFreeShipping') {
    // discount automatic free shipping
    await updateAutomaticFreeShippingDiscount(admin_graphql_api_id);
  } else if (type === 'DiscountCodeBasic') {
    // discount code basic
    await updateDiscountCodeBasic(admin_graphql_api_id);
  } else if (type === 'DiscountCodeBxgy') {
    // discount code bxgy
    await updateDiscountCodeBxgy(admin_graphql_api_id);
  } else {
    console.log('No matching discount type');
    return false;
  }

  return admin_graphql_api_id;
};

export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createErrorResponse('No body provided', 400);
    }

    const signatureHeader =
      event.headers['x-shopify-hmac-sha256'] ||
      event.headers['X-Shopify-Hmac-Sha256'];

    if (!signatureHeader) {
      return createUnauthorizedResponse('No signature provided');
    }

    const body: WebhookDiscountBody = JSON.parse(event.body);

    const verified = verifyWebhook(signatureHeader!, event.body);

    if (!verified) {
      console.log('Request not verified');
      return createUnauthorizedResponse('Request not verified');
    }

    console.log('Request verified');

    const id = await updateDiscount(body);

    if (!id) {
      return createErrorResponse(
        `Something went wrong, Discount: ${id} not updated`,
        500
      );
    }

    return createSuccessResponse(`Discount updated: ${id}`);
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'An error occurred',
      500
    );
  }
};
