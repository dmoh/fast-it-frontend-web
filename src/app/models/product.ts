export class Product {
    name: string = '';
    id: number = 0;
    amount: number = 0;
    quantity: number = 0; // Quantity chosen by customer
    // tslint:disable-next-line:variable-name
    remaining_quantity: number = 0;
    description = '';
    urlPhoto?: string = '';
    additionalInformations?: string = '';
}
