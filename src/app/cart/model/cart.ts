import {Product} from '@app/models/product';

export class Cart {
    products: Product[] = [];
    deliveryCost: number = 0;
    tva: number = 0.19;
    total: number = 0;
    serviceCharge?: number = 0.4;
    restaurant?: any;
    hasServiceCharge: boolean = false;
}
