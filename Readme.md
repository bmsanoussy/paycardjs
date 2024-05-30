# Paycardjs Library

Paycardjs is a Node.js library for creating and managing payments using the Paycard API. This library provides an easy-to-use interface for integrating Paycard payment functionality into your Node.js applications.

Using Paycardjs, you can make payments via Orange Money Guinea, MTN MoMo, VISA, and Paycard.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Initialize the library](#initialization)
  - [Configuring payment information](#configuring-payment)
  - [Creating a Payment](#creating-a-payment)
  - [Getting Payment Status](#getting-payment-status)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Installation

Install the library using npm:

```bash
npm install paycardjs
```

## Usage

You can find an example of the library's use in [javascript](src/tests/paycard.manual-test.js) and [typescript](src/tests/paycard.manual-test.ts)

### initialize the library

Instantiate a payment with your Paycard API_KEY

```typescript
const paycard = new Paycard('your-api-key');
```

### Configuring payment information

```typescript
const createPaymentRequest: CreatePaymentRequest = {
    amount: 100,
    description: 'Test payment',
};
```

| Field           | Type          |Mandatory | Description                                        |
|-----------------|---------------|----------|----------------------------------------------------|
| amount          | number        |  Yes     | The amount to be paid. Must be greater than 0.     |
| description     | string        |  Yes     | Description of the payment.                        |
| reference       | string        |  No      | Unique reference for the payment. if you do not provide a reference, Paycard generates one for the payment |
| paymentMethod   | PaymentMethod |  No      | The payment method to use. The possible values are: CREDIT_CARD, MOMO, ORANGE_MONEY, PAYCARD |
| callbackUrl     | string        |  No      | URL to be called back after payment.               |
| autoRedirect    | boolean       |  No      | Auto redirect after payment (default: false).      |
| redirectWithGet | boolean       |  No      | Use GET for redirect (default: false).             |

### Creating a Payment

```typescript
paycard.createPayment(createPaymentRequest)
    .then(response => {
        console.log('Payment created successfully:', response);
    })
    .catch(error => {
        console.error('Error creating payment:', error);
    });
```

| Field                    | Type   | Description                          |
|--------------------------|--------|--------------------------------------|
| code                     | number | Response code (0 for success).       |
| payment_amount           | number | Amount paid.                         |
| payment_amount_formatted | string | Formatted payment amount.            |
| payment_description      | string | Description of the payment.          |
| operation_reference      | string | Reference for the payment operation. |
| payment_url              | string | URL for completing the payment.      |
| error_message            | string | Error message if any error occurred. |

### Getting Payment Status

```typescript
paycard.getPaymentStatus('test-ref')
    .then(response => {
        console.log('Payment status:', response);
    })
    .catch(error => {
        console.error('Error getting payment status:', error);
    });
```
| Field                    | Type   | Description                                     |
|--------------------------|--------|-------------------------------------------------|
| code                     | number | Response code (0 for success).                  |
| payment_amount           | number | Date of the transaction.                        |
| payment_amount_formatted | string | Status of the payment.                          |
| payment_description      | string | Description of the payment status.              |
| payment_method           | number | The method used for payment.                    |
| payment_reference        | string | Reference of the payment in the Paycard system. |
| payment_method_reference | string | Reference of the payment method used.           |
| reference                | string | Reference for the payment.                      |
| status_description       | string | Description of the payment status.              |
| status                   | string | Status of the payment.                          |
| ecommerce_description    | string | Description for the ecommerce transaction.      |
| transaction_date         | string | Date of the transaction.                        |
| merchant_name            | string | Name of the merchant.                           |
| error_message            | string | Error message if any error occurred.            |

## Error Handling

The library throws custom errors for various error conditions. These errors can be imported and used for handling specific error cases.

```typescript
import { PaymentError, PaymentErrorType } from 'paycard';
...
paycard.createPayment(createPaymentRequest)
    .catch(error => {
        if (error instanceof PaymentError) {
        switch (error.type) {
            case PaymentErrorType.INVALID_PAYMENT_AMOUNT:
                console.error('Invalid payment amount');
                break;
            case PaymentErrorType.INVALID_CALBACK_URL:
                console.error('Invalid callback URL');
                break;
            // Handle other error types
            default:
                console.error('Payment error:', error.message);
        }
    } else {
        console.error('Unexpected error:', error);
    }
    });
```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue on GitHub.

- Fork the repository.
- Create a new branch.
- Make your changes.
- Open a pull request.