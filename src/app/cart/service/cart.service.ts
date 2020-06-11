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
        this.cartCurrent.products.push(product);
        this.emitCartSubject();
        console.warn('carCi', this.cartCurrent);
    } else if(type === 'remove') {
        this.cartCurrent.products = this.cartCurrent.products.filter((prod: Product) => product.id !== prod.id);
        this.emitCartSubject();
    }
  }

  emitCartSubject(){
    this.cartSubject.next(this.cartCurrent);
  }

}
