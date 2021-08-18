import {Product} from '@app/models/product';
import {Restaurant} from '@app/_models/restaurant';

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
    promotionalCode?;
    hasShownTipModal?: boolean = false;
    sectorId?: number;
}
