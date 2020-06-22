import { Injectable } from '@angular/core';
import {Product} from "../../models/product";
import {Cart} from "../model/cart";
import {BehaviorSubject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCurrent: Cart = new Cart();
  cartSubject = new BehaviorSubject<Cart>(this.cartCurrent);
  cartUpdated = this.cartSubject.asObservable();


  constructor() { }


  UpdateCart(type: string, product: Product): void {
    if(type === 'add') {
        if(!this.cartCurrent) {
            this.cartCurrent = new Cart();
        }
        const arrayProductsCurrent = this.cartCurrent.products;
        const index = arrayProductsCurrent.findIndex(prod => prod.id === product.id);
        if(index !== -1) {
            this.cartCurrent.products[index].quantity += product.quantity;
        } else {
            this.cartCurrent.products.push(product);
        }
        /*this.cartCurrent.products = this.cartCurrent.products.filter((productInCart: Product) => {
            if (productInCart.id === product.id) {
                console.warn('je passe');
                productInCart.quantity += product.quantity;
            }
        });*/
        // if(index === -1) {
        // }
        this.emitCartSubject();
    } else if(type === 'remove') {
        this.cartCurrent.products = this.cartCurrent.products.filter((prod: Product) => product.id !== prod.id);
        this.emitCartSubject();
    }
  }

  emitCartSubject(){
    console.warn('cartCurrent', this.cartCurrent);
    this.cartSubject.next(this.cartCurrent);
  }

}
