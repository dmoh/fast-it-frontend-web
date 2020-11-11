import {CategoryProduct} from "@app/_models/category-product";

export class Product {
    name: string = '';
    id: number = 0;
    amount: number = 0;
    quantity: number = 0;
    category: CategoryProduct = new CategoryProduct();
    business_id: number;
    // Quantity chosen by customer
    // tslint:disable-next-line:variable-name
    remaining_quantity: number = 0;
    createdAt: string;
    updatedAt: string;
    commentCustomer: string;
    addComment: boolean = false;
    supplmentsProduct: any[];
    infoCommentCustomer: string;
    description = '';
    photo?: string = '';
    urlPhoto?: string = '';
    url_photo?: string;
    additionalInformations?: string = '';
    isAvailable?: boolean = true;
}
