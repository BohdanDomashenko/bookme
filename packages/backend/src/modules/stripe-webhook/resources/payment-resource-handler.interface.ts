import { PaymentResourceType } from 'generated/prisma/enums';

export interface PaymentResourceHandler<
  ResourceType extends PaymentResourceType = PaymentResourceType,
> {
  readonly type: ResourceType;
  handle(input: {
    paymentId: string;
    resource: PaymentResourceType;
  }): Promise<void>;
}
