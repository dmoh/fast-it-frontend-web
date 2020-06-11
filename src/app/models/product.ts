export class Product {
    name: string = '';
    id: number = 0;
    price: number = 0;
    quantity: number = 0; // Quantity chosen by customer
    remainingQuantity: number = 0;
    ingredients: string = '';
    urlPhoto?: string = '';
    additionalInformations?: string = '';
}