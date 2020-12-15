import {Product} from '@app/models/product';

export class Cart {
    products: Product[] = [];
    deliveryCost: number = 0;
    tva: number = 0;
    total: number = 0;
    tipDelivererAmount: number = 0;
    serviceCharge?: number = 0;
    restaurant?: any;
    isValidate?: boolean = false;
    hasServiceCharge: boolean = false;
}
