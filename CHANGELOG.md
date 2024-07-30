# CHANGELOG

## v.1.2 - 2024-06-14

**Features**

- Added `/getDiscountedCollectionPricing` endpoint
  - This endpoint fetches discounted pricing for products within a specific collection.
  - **Request Body**:
    ```json
    {
      "offer": "string",
      "handle": "string",
      "collectionId": "number"
    }
    ```
  - **Response Body**:
    ```json
    {
      "prices": [
        {
          "id": "string",
          "discountedPrice": "number"
        }
      ],
      "type": "string",
      "appliedDiscount": {
        // Details of the applied discount
      }
    }
    ```
  - **Limitation**: Discounts only apply if the collection is explicitly listed in the discount's rules. If the collection is not listed, the discount will not be applied.

## v.1.1 - 2024-06-13

**Features**

- Added `/getDiscountProductPricing` endpoint
  - This endpoint fetches discounted pricing for a specific product based on an offer from the request.
  - **Request Body**:
    ```json
    {
      "offer": "string",
      "handle": "string",
      "productId": "number",
      "prices": [
        {
          "id": "string",
          "price": "number"
        }
      ]
    }
    ```
  - **Response Body**:
    ```json
    {
      "prices": [
        {
          "id": "string",
          "discountedPrice": "number"
        }
      ],
      "type": "string"
    }
    ```
  - **Limitation**: Discounts only apply to products explicitly listed in the discount's rules. If the product is not listed, the discount will not be applied.

## v.1.0 - Initial Commit

- Initial setup and commit of the lambda project.
