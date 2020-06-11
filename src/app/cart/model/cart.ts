import {Product} from "../../models/product";

export class Cart {
    products: Product[] = [];
    deliveryCost: number = 0;
    tva: number = 0.19;
    total: number = 0;
}
