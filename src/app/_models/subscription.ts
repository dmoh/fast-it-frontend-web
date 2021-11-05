export class Subscription {
    subType: number;
    title: string;
    amount: number;
    percent: number;
    isFreeShippingCost: boolean;
    subscriptionCapacityId?: number;
    isActive?: boolean;
    isCancel?: boolean;
    isLocked?: boolean;
}
