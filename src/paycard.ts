import axios from 'axios';
import { PaymentError, PaymentErrorType } from './payment-error';

class Paycard {
    private apiKey: string;
    private baseUrl: string;
    private client: any;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://mapaycard.com';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async createPayment(createPaymentRequest: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        if(createPaymentRequest.amount <= 0) {
            throw new PaymentError('Amount must be greater than 0', PaymentErrorType.INVALID_PAYMENT_AMOUNT);
        }
        if(createPaymentRequest.callbackUrl && !isValidUrl(createPaymentRequest.callbackUrl)) {
            throw new PaymentError('Callback URL must be a valid URL', PaymentErrorType.INVALID_CALBACK_URL);
        }

        let response;
        try {
            response = await this.client.post('/epay/create', {
                c: this.apiKey,
                'paycard-amount': createPaymentRequest.amount,
                'paycard-description': createPaymentRequest.description || null,
                'paycard-operation-reference': createPaymentRequest.reference || null,
                'paycard-callback-url': createPaymentRequest.callbackUrl || null,
                'paycard-auto-redirect': createPaymentRequest.autoRedirect ? 'on' : 'off',
                'paycard-redirect-with-get': createPaymentRequest.redirectWithGet ? 'on' : 'off',
                ...(createPaymentRequest.paymentMethod === PaymentMethod.PAYCARD && { 'paycard-jump-to-paycard': "on" }),
                ...(createPaymentRequest.paymentMethod === PaymentMethod.CREDIT_CARD && { 'paycard-jump-to-cc': "on" }),
                ...(createPaymentRequest.paymentMethod === PaymentMethod.ORANGE_MONEY && { 'paycard-jump-to-om': "on" }),
                ...(createPaymentRequest.paymentMethod === PaymentMethod.MOMO && { 'paycard-jump-to-momo': "on" }),
            });
            
        } catch (error: any) {
            throw new PaymentError(`API call failed: ${error.message}`);
        }

        const data: CreatePaymentResponse = response.data;
        if(data.code !== 0) {
            throw new PaymentError(data.error_message || 'Unknown error', PaymentErrorType.PAYCAR_ERROR);
        }
        return data;
    }

    async getPaymentStatus(reference: string): Promise<PaymentStatusResponse> {
        try {
            const response = await this.client.get(`/epay/${this.apiKey}/${reference}/status`);
            const data: PaymentStatusResponse = response.data;
            if(data.code !== 0) {
                throw new PaymentError(response.error_message || 'Unknown error', PaymentErrorType.PAYCAR_ERROR);
            }
            return data;
        } catch (error: any) {
            throw new PaymentError(`API call failed: ${error.message}`);
        }
    }
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export type CreatePaymentRequest = {
    amount: number;
    description: string;
    reference?: string | null;
    paymentMethod: PaymentMethod;
    callbackUrl?: string  | null;
    autoRedirect?: boolean;
    redirectWithGet?: boolean;
}

export type CreatePaymentResponse = {
    code: number;
    payment_amount: number;
    payment_amount_formatted?: string | null;
    payment_description: string;
    operation_reference: string;
    payment_url: string;
    error_message?: string | null;
}

export type PaymentStatusResponse = {
    code: number;
    transaction_date?: string | null;
    status: string;
    status_description: string;
    error_message: string;
    payment_method?: string | null;
    payment_description?: string | null;
    reference: string;
    payment_reference?: string | null;
    payment_method_reference?: string | null;
    payment_amount: string;
    payment_amount_formatted: string;
    ecommerce_description: string;
    merchant_name?: string | null;
}   

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    MOMO = 'MOMO',
    ORANGE_MONEY = 'ORANGE_MONEY',
    PAYCARD = 'PAYCARD',
}

export default Paycard;
