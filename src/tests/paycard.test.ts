import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Paycard, { CreatePaymentRequest, PaymentMethod } from '../paycard';


describe('Paycard', () => {
    let mock: MockAdapter;
    let paycard: Paycard;

    beforeAll(() => {
        paycard = new Paycard('test-api-key');
    });

    beforeEach(() => {
        mock = new MockAdapter(paycard['client']);
    });

    afterEach(() => {
        mock.reset();
    });

    describe('createPayment', () => {
        it('should throw an error if amount is less than or equal to 0', async () => {
            const request: CreatePaymentRequest = {
                amount: 0,
                description: 'Test payment',
                reference: 'test-ref',
                paymentMethod: PaymentMethod.PAYCARD,
                callbackUrl: 'http://example.com/callback',
                autoRedirect: true,
                redirectWithGet: false
            };

            await expect(paycard.createPayment(request)).rejects.toThrowErrorMatchingSnapshot();
        });

        it('should throw an error if callbackUrl is invalid', async () => {
            const request: CreatePaymentRequest = {
                amount: 100,
                description: 'Test payment',
                reference: 'test-ref',
                paymentMethod: PaymentMethod.PAYCARD,
                callbackUrl: 'invalid-url',
                autoRedirect: true,
                redirectWithGet: false
            };

            await expect(paycard.createPayment(request)).rejects.toThrowErrorMatchingSnapshot();
        });

        it('should create a payment successfully', async () => {
            const request: CreatePaymentRequest = {
                amount: 100,
                description: 'Test payment',
                reference: 'test-ref',
                paymentMethod: PaymentMethod.PAYCARD,
                callbackUrl: 'https://example.com/callback',
                autoRedirect: true,
                redirectWithGet: false
            };

            const response = {
                code: 0,
                payment_amount: 100,
                payment_description: 'Test payment',
                operation_reference: 'test-ref',
                payment_url: 'http://example.com/payment'
            };

            mock
                .onPost('/epay/create')
                .replyOnce(200, response);

            const result = await paycard.createPayment(request);

            expect(mock.history).toMatchSnapshot();
            expect(result).toMatchSnapshot();
        });

        it('should throw an error if paycard response code is not 0', async () => {
            const request: CreatePaymentRequest = {
                amount: 100,
                description: 'Test payment',
                reference: 'test-ref',
                paymentMethod: PaymentMethod.PAYCARD,
                callbackUrl: 'http://example.com/callback',
                autoRedirect: true,
                redirectWithGet: false
            };

            const response = {
                code: -1,
                error_message: 'Invalid amount',
            };

            mock
                .onPost('/epay/create')
                .replyOnce(200, response);

            await expect(paycard.createPayment(request)).rejects.toThrowErrorMatchingSnapshot();
        });

        it('should throw an error if API call fails', async () => {
            const request: CreatePaymentRequest = {
                amount: 100,
                description: 'Test payment',
                reference: 'test-ref',
                paymentMethod: PaymentMethod.PAYCARD,
                callbackUrl: 'http://example.com/callback',
                autoRedirect: true,
                redirectWithGet: false
            };

            mock
                .onPost('/epay/create')
                .networkError();

            await expect(paycard.createPayment(request)).rejects.toThrowErrorMatchingSnapshot();
        });
    });

    describe('getPaymentStatus', () => {
        it('should get payment status successfully', async () => {
            const reference = 'test-ref';
            const response = {
                code: 0,
                status: 'SUCCESS',
                status_description: 'Payment successful',
                error_message: '',
                payment_amount: '100',
                payment_amount_formatted: '100',
                ecommerce_description: 'Test payment',
                reference: 'test-ref'
            };

            mock
                .onGet(`/epay/test-api-key/${reference}/status`)
                .replyOnce(200, response);

            const result = await paycard.getPaymentStatus(reference);

            expect(mock.history).toMatchSnapshot();
            expect(result).toMatchSnapshot();
        });

        it('should throw an error if paycard response code is not 0', async () => {
            const reference = 'test-ref';

            const response = {
                code: -1,
                error_message: 'Unknown reference',
            };

            mock
                .onGet(`/epay/test-api-key/${reference}/status`)
                .replyOnce(200, response);

            await expect(paycard.getPaymentStatus(reference)).rejects.toThrowErrorMatchingSnapshot();
        });

        it('should throw an error if API call fails', async () => {
            const reference = 'test-ref';

            mock
                .onGet(`/epay/test-api-key/${reference}/status`)
                .networkError();

            await expect(paycard.getPaymentStatus(reference)).rejects.toThrowErrorMatchingSnapshot();
        });
    });
});
