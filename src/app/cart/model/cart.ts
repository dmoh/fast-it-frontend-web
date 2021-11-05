import {Product} from '@app/models/product';
import {Restaurant} from '@app/_models/restaurant';
import {Subscription} from "@app/_models/subscription";

export class Cart {
    products: Product[] = [];
    deliveryCost: number = 0;
    tva: number = 0;
    total: number = 0;
    tipDelivererAmount = 0.0;
    serviceCharge?: number = 0;
    restaurant?: Restaurant;
    isValidate?: boolean = false;
    hasServiceCharge: boolean = false;
    totalAmountProduct?: number = 0;
    stripeFee?: number = 0;
    amountWithoutSpecialOffer: number = 0;
    comment: string = '';
    totalWithoutDiscount: number = 0;
    promotionalCode?: {
        percentage?: number,
        totalAmountProductWithPromotion?: number,
        totalAmountProduct?: number,
        id?: number, applicatedTo?:number
    } = {
        percentage: 0,
        totalAmountProductWithPromotion: 0,
        totalAmountProduct: 0
    };
    hasShownTipModal?: boolean = false;
    sectorId?: number;
    subscription?: Subscription = new Subscription();
    distance?: number = 0;
}
