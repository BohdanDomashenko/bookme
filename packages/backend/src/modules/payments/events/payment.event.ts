export class PaymentEvent {
  constructor(public readonly data: { type: PaymentType; resourceType:  }) {}
}