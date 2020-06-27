import { Injectable } from '@angular/core';
import {Product} from "../../models/product";
import {Cart} from "../model/cart";
import {BehaviorSubject, Observable} from "rxjs/index";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCurrent: Cart = new Cart();
  cartSubject = new BehaviorSubject<Cart>(this.cartCurrent);
  cartUpdated = this.cartSubject.asObservable();
  headers: any;



  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (localStorage.getItem('cart_fast_eat')) {
      this.setCart(JSON.parse(localStorage.getItem('cart_fast_eat')));
    }
  }


  UpdateCart(type: string, product: Product): void {
    if (type === 'add') {
        if (!this.cartCurrent) {
            this.cartCurrent = new Cart();
        }
        const arrayProductsCurrent = this.cartCurrent.products;
        const index = arrayProductsCurrent.findIndex(prod => prod.id === product.id);
        if (index !== -1) {
            this.cartCurrent.products[index].quantity = product.quantity;
        } else {
            this.cartCurrent.products.push(product);
        }
        this.generateTotalCart();
        this.emitCartSubject();
    } else if (type === 'remove') {
        this.cartCurrent.products = this.cartCurrent.products.filter((prod: Product) => product.id !== prod.id);
        this.generateTotalCart();
        this.emitCartSubject();
    }
  }

  setCart(cart: Cart): void {
    this.cartCurrent = cart;
    this.emitCartSubject();
  }

  emitCartSubject(){
    // todo voir si autre solution avec Elhad save on DB temporairement ??? le panier
    localStorage.setItem('cart_fast_eat', JSON.stringify(this.cartCurrent));
    this.cartSubject.next(this.cartCurrent);
  }

  private generateTotalCart(): void {
    this.cartCurrent.total = 0;
    this.cartCurrent.products.forEach((prod: Product) => {
      this.cartCurrent.total += +(prod.quantity * prod.price);
    });
    // if (this.cartCurrent.serviceCharge === 0.4)
    // this.cartCurrent.total  += (!!this.cartCurrent.serviceCharge ? 0.4 :
    // this.cartCurrent.serviceCharge)  + this.cartCurrent.deliveryCost;
    // todo declarer constante serviceCharge et calcul du cout de livraison
  }

  /*getTokenPaymentIntent(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/payment/token-payment`, this.headers);
  }*/

  getTokenPaymentIntent(amount: number, currency: string = 'EUR'): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/payment/token-payment`, { amount, currency}, this.headers);
  }

}
