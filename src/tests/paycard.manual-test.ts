import Paycard, { PaymentMethod } from '../paycard';

async function testCreatePayment() {
    const paycard = new Paycard('your-api-key');

    const createPaymentRequest = {
        amount: 100,
        description: 'Test payment',
        reference: 'test-ref',
        paymentMethod: PaymentMethod.PAYCARD,
        callbackUrl: 'http://example.com/callback',
        autoRedirect: true,
        redirectWithGet: false
    };

    try {
        const response = await paycard.createPayment(createPaymentRequest);
        console.log('Payment created successfully:', response);

        const statusResponse = await paycard.getPaymentStatus('test-ref');
        console.log('Payment status:', statusResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}

testCreatePayment();
