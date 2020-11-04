import {CategoryProduct} from "@app/_models/category-product";

export class Product {
    name: string = '';
    id: number = 0;
    amount: number = 0;
    quantity: number = 0;
    category: CategoryProduct = new CategoryProduct() ;
    business_id: number;
    // Quantity chosen by customer
    // tslint:disable-next-line:variable-name
    remaining_quantity: number = 0;
    created_at: {date};
    updated_at: {date};
    supplmentsProduct: any[];
    description = '';
    photo?: string = '';
    urlPhoto?: string = '';
    additionalInformations?: string = '';
    isAvailable?: boolean = true;
}
