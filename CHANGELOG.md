# CHANGELOG

## v.0.0.1 - Initial Commit - 2024-07-30

- Initial setup and commit of the lambda project.

**Features**

- Added `/update-discount` endpoint

  - This endpoint updates a Shopify discount, it makes it combineable with shipping discounts.
  - This endpoint receives a discount payload from a Shopify Webhook
  - The discount is fetched by its ID. We need to know it's type.
  - The discount is then updated as combinable with shipping discounts.
  - **Request Body**:

    ```json
    {
      "admin_graphql_api_id": string,
      "title": string,
      "status": string,
      "created_at": string,
      "updated_at": string
    }

    ```

    - **Example Request Body**:

    ```json
    {
      "admin_graphql_api_id": "gid://shopify/DiscountCodeNode/1166641397843",
      "title": "DISCOUNT_TEST",
      "status": "ACTIVE",
      "created_at": "2024-07-30T12:34:37-07:00",
      "updated_at": "2024-07-30T12:34:37-07:00"
    }
    ```

  - **Limitation**: This endpoint is used to update the given discount and make it combineable with all shipping discounts.
