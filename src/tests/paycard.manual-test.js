const Paycard = require('../../dist/index').default; // require('paycardjs').default;
const { PaymentMethod } = require('../../dist/index'); // require('paycardjs');

const paycard = new Paycard('your-api-key');

const reference = 'test-reference-js';

const createPaymentRequest = {
    amount: 100,
    description: 'Test payment',
    reference,
    paymentMethod: PaymentMethod.PAYCARD,
    callbackUrl: 'http://example.com/callback',
    autoRedirect: true,
    redirectWithGet: false
};

paycard.createPayment(createPaymentRequest)
    .then(response => {
        console.log('Payment created successfully:', response);
    })
    .catch(error => {
        console.error('Error creating payment:', error);
    });

// Checking payment status
paycard.getPaymentStatus(reference)
    .then(response => {
        console.log('Payment status:', response);
    })
    .catch(error => {
        console.error('Error getting payment status:', error);
    });
