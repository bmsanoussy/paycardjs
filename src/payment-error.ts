export class PaymentError extends Error {
    public readonly type: PaymentErrorType;
    constructor(
      message: string,
      type: PaymentErrorType = PaymentErrorType.UNKNOWN_ERROR
    ) {
      super(message);
      this.type = type;
    }
}
  
export enum PaymentErrorType {
    INVALID_PAYMENT_AMOUNT = "INVALID_PAYMENT_AMOUNT",
    INVALID_CALBACK_URL = "INVALID_CALBACK_URL",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    PAYCAR_ERROR = "PAYCAR_ERROR",
}