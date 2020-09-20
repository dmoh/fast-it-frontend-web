import { Injectable } from '@angular/core';
import {Product} from "../../models/product";
import {Cart} from "../model/cart";
import {BehaviorSubject, Observable} from "rxjs/index";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCurrent: Cart = new Cart();
  cartSubject = new BehaviorSubject<Cart>(this.cartCurrent);
  cartUpdated = this.cartSubject.asObservable();
  protected tokenUserCurrent: string;
  headers: any;
  urlApi: string = 'http://localhost:8000/';


  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (localStorage.getItem('cart_fast_eat')) {
      this.setCart(JSON.parse(localStorage.getItem('cart_fast_eat')));
    }
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    }
    if (this.authenticate.tokenUserCurrent) {
     this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }


  UpdateCart(type: string, product: Product, restaurant?: any): void { // todo enlever majuscule de cette méthode
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
        this.cartCurrent.restaurant = restaurant;
        this.generateTotalCart();
        this.emitCartSubject();
    } else if (type === 'update') {
        const arrayProductsCurrent = this.cartCurrent.products;
        const index = arrayProductsCurrent.findIndex(prod => prod.id === product.id);
        this.cartCurrent.products[index] = product;
        this.generateTotalCart();
        this.emitCartSubject();
    } else if (type === 'remove') {
        this.cartCurrent.products = this.cartCurrent.products.filter((prod: Product) => product.id !== prod.id);
        this.generateTotalCart();
        this.emitCartSubject();
    }
  }

  setDeliveryCost(deliveryCost: number) {
    this.cartCurrent.deliveryCost = deliveryCost;
    this.generateTotalCart();
    this.emitCartSubject();
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
      this.cartCurrent.total += +(prod.quantity * prod.amount) / 100;
    });
    this.cartCurrent.total += +(this.cartCurrent.deliveryCost);
    // if (this.cartCurrent.serviceCharge === 0.4)
    // this.cartCurrent.total  += (!!this.cartCurrent.serviceCharge ? 0.4 :
    // this.cartCurrent.serviceCharge)  + this.cartCurrent.deliveryCost;
    // todo declarer constante serviceCharge et calcul du cout de livraison
  }

  /*getTokenPaymentIntent(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/payment/token-payment`, this.headers);
  }*/

  getTokenPaymentIntent(amountCart: number, currencyCart: string = 'EUR'): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/payment/token-payment`,
      { amount: amountCart, currency: currencyCart }, this.headers);
  }

  // saveOrder()
  saveOrder(cartOrder: {}): Observable<any> {
    return this.http.post<any>(`${ this.urlApi }order/save`,
      JSON.stringify(cartOrder), this.headers);
  }

  getCostDelivery(dataDistance: any): Observable<any> {
    return this.http.post<any>(`${ this.urlApi }delivery/cost`,
      JSON.stringify(dataDistance), this.headers);
  }
  saveCodeCustomerToDeliver(responseCustomer): Observable<any> {
    return this.http.post<any>(`${this.urlApi}order/save/delivery-code`,
      responseCustomer, this.headers);
  }
}
