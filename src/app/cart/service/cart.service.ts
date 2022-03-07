import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { Cart } from '../model/cart';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { isNumeric } from "tslint";
import { RestaurantDashboardService } from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import { CartDetailComponent } from "@app/cart/cart-detail/cart-detail.component";
import { limitDistanceSubscription } from "@app/_util/fasteat-constants";
import { PromotionalCode } from "@app/_models/promotional-code";
import { Promotion } from "@app/_models/promotion";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCurrent: Cart = new Cart();
  cartSubject = new BehaviorSubject<Cart>(this.cartCurrent);
  cartUpdated = this.cartSubject.asObservable();
  protected tokenUserCurrent: string;
  headers: any;
  urlApi: string = environment.apiUrl + '/';
  user: any;
  limitDistance = limitDistanceSubscription

  constructor(private http: HttpClient,
    private authenticate: AuthenticationService,
    private router: Router,
    private restaurantDashboardService: RestaurantDashboardService
  ) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    if (localStorage.getItem('cart_fast_eat')) {
      this.setCart(JSON.parse(localStorage.getItem('cart_fast_eat')));
    }
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    }
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`);
    }

    this.authenticate.currentUser
      .subscribe((user) => {
        if (user) {
          this.user = user;
          if (user.data && user.data.subscription) {
            this.cartCurrent.subscription = user.data.subscription;
          }
        }
      });


  }


  UpdateCart(type: string, product?: Product, restaurant?: any): void { // todo enlever majuscule de cette méthode
    if (type === 'add') {
      if (!this.cartCurrent) {
        this.cartCurrent = new Cart();
      }
      if (this.cartCurrent.products.length === 0) {
        product.indexProduct = 1;
      } else {
        product.indexProduct = this.cartCurrent.products.length++;
      }
      // let indexProd = 0;
      if (this.cartCurrent.products.length > 0) {
        this.cartCurrent.products = this.cartCurrent.products.filter((prod) => {
          return typeof prod !== 'undefined' && prod !== null ? prod : '';
        });
      }
      this.cartCurrent.products = [...this.cartCurrent.products, product];
      this.cartCurrent.restaurant = restaurant;
      this.generateTotalCart();
      this.emitCartSubject();
    } else if (type === 'update') {
      const arrayProductsCurrent = this.cartCurrent.products;
      const index = arrayProductsCurrent.findIndex(prod => prod.id === product.id);
      this.cartCurrent.products[index] = product;
      this.generateTotalCart(true);
      this.emitCartSubject();
    } else if (type === 'remove') {
      this.cartCurrent.products = this.cartCurrent.products.filter((prod: Product) => product.id !== prod.id);
      this.generateTotalCart(true);
      this.emitCartSubject();
    } else if (type === 'empty-cart') {
      this.cartCurrent = new Cart();
      this.emitCartSubject('empty');
    }
  }

  setHasServiceCharge() {
    this.cartCurrent.hasServiceCharge = true;
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

  emitCartSubject(empty?: string) {
    if (empty === 'empty') {
      localStorage.removeItem('cart_fast_eat');
      this.cartCurrent = new Cart();
    } else {
      localStorage.setItem('cart_fast_eat', JSON.stringify(this.cartCurrent));
    }
    // todo voir si autre solution avec Elhad save on DB temporairement ??? le panier

    this.cartSubject.next(this.cartCurrent);
  }

  public generateTotalCart(isCheckout?: boolean): void {
    this.cartCurrent.total = 0;
    this.cartCurrent.totalWithoutDiscount = 0;
    this.cartCurrent.totalAmountProduct = 0;
    this.cartCurrent.amountWithoutSpecialOffer = 0;
    this.cartCurrent.products.forEach((prod: Product) => {
      if (typeof prod !== 'undefined' && prod !== null) {
        if (typeof prod.supplementProducts !== 'undefined' && prod.supplementProducts.length > 0) {
          /* prod.supplementProducts.forEach((elem) => {
             if (elem.amount && +(elem.amount) > 0) {
               console.warn('elem', elem.name);
               console.warn('price', elem.amount);
               this.cartCurrent.total += +(elem.amount) / 100;
               // todo voir pour la quantité des suppléments
             }
           });*/
        }
        this.cartCurrent.total += +(prod.quantity * prod.amount) / 100;
        this.cartCurrent.totalWithoutDiscount += +(prod.quantity * prod.amount) / 100;
        this.cartCurrent.totalAmountProduct += +(prod.quantity * prod.amount) / 100;
        this.cartCurrent.amountWithoutSpecialOffer += +(prod.quantity * prod.amount) / 100;

        if ((this.cartCurrent.promotionalCode
          && this.cartCurrent.promotionalCode.percentage
          && +this.cartCurrent.promotionalCode.percentage > 0)
          || this.hasPercentPromotionSubscription()
        ) {
          if (this.hasPercentPromotionSubscription()) {
            this.cartCurrent.promotionalCode = new Promotion();
          }
          this.cartCurrent.promotionalCode.totalAmountProduct = this.cartCurrent.totalAmountProduct;
        }
      }
    });

    if ((this.cartCurrent.promotionalCode
      && this.cartCurrent.promotionalCode.percentage
      && +this.cartCurrent.promotionalCode.percentage > 0)
      || this.hasPercentPromotionSubscription()
    ) {
      if (this.hasPercentPromotionSubscription()) {
        this.cartCurrent.promotionalCode.percentage = this.user.data.subscription.percent;
      }
      this.cartCurrent.promotionalCode.totalAmountProductWithPromotion = 0;
      this.cartCurrent.promotionalCode.totalAmountProductWithPromotion
        = this.cartCurrent.promotionalCode.totalAmountProduct
        - (this.cartCurrent.promotionalCode.percentage / 100 * this.cartCurrent.promotionalCode.totalAmountProduct)
        ;
      this.cartCurrent.total = this.cartCurrent.total - (this.cartCurrent.promotionalCode.percentage / 100 * this.cartCurrent.total);
      this.cartCurrent.totalAmountProduct = this.cartCurrent.promotionalCode.totalAmountProductWithPromotion;
      this.cartCurrent.amountWithoutSpecialOffer = this.cartCurrent.promotionalCode.totalAmountProductWithPromotion;
    }

    // check if merchant as already promotion
    if (
      typeof this.cartCurrent.restaurant.specialOffer !== 'undefined'
      && !this.hasPercentPromotionSubscription()
    ) {
      if (
        +(this.cartCurrent.restaurant.specialOffer.minimumAmountForOffer) <=
        +(this.cartCurrent.total)
      ) {
        this.cartCurrent.total -= +(this.cartCurrent.restaurant.specialOffer.specialOfferAmount);
      }
    }
    if (typeof this.cartCurrent.tipDelivererAmount !== 'undefined'
      && +this.cartCurrent.tipDelivererAmount > 0
    ) {
      const tip = (this.cartCurrent.tipDelivererAmount).toFixed(2);
      this.cartCurrent.total += parseFloat(tip);
      this.cartCurrent.totalWithoutDiscount += parseFloat(tip);
      this.cartCurrent.amountWithoutSpecialOffer += parseFloat(tip);
    }
    // this.cartCurrent.total += 0.80;
    // this.cartCurrent.amountWithoutSpecialOffer += 0.80;
    this.cartCurrent.total += this.isFreeShippingCost() ? 0 : +(this.cartCurrent.deliveryCost);
    this.cartCurrent.totalWithoutDiscount += +(this.cartCurrent.deliveryCost);
    this.cartCurrent.amountWithoutSpecialOffer += this.isFreeShippingCost() ? 0 : +(this.cartCurrent.deliveryCost);

    if (isCheckout) {
      const fastItFee = this.getFastItFee( this.cartCurrent?.promotionalCode?.totalAmountProduct ?? this.cartCurrent.totalAmountProduct);
      this.cartCurrent.stripeFee = (this.cartCurrent.total - (this.cartCurrent.total * 0.986)) + 0.35 + 2.50 - fastItFee;
      const fee = (this.cartCurrent.stripeFee).toFixed(2);
      this.cartCurrent.total += parseFloat(fee);
      this.cartCurrent.totalWithoutDiscount += parseFloat(fee);
      this.cartCurrent.amountWithoutSpecialOffer += parseFloat(fee);
    }
    this.cartCurrent.total = +this.cartCurrent.total.toFixed(2);
    this.emitCartSubject();
  }

  getFloatTotalAmount(): number {
    this.generateTotalCart(true);
    return this.cartCurrent.total;
  }

  getIntTotalAmount() {
    this.generateTotalCart(true);
    if (this.cartCurrent.total && this.cartCurrent.total > 0) {
      const amount = this.cartCurrent.total.toFixed(2);
      return Math.round(+amount * 100);
    }
    return 0;
  }

  getTokenPaymentIntent(
    amountCart: number,
    restId: number,
    delivery: number,
    stripe?: number,
    currencyCart: string = 'EUR'): Observable<any> {
    return this.http.post<any>(`${this.urlApi}payment/token-payment`,
      {
        amount: amountCart,
        currency: currencyCart,
        restaurantId: restId,
        deliveryCost: delivery,
        stripeFee: stripe
      }, this.headers);
  }


  getFormTokenPaymentSystemPay(
    amountCart: number,
    restId: number,
    delivery: number,
    stripe?: number,
    currencyCart: string = 'EUR'): Observable<any> {

    return this.http.post<any>(`${this.urlApi}payment/token-payment`,
      {
        amount: amountCart,
        currency: currencyCart,
        restaurantId: restId,
        deliveryCost: delivery,
        stripeFee: stripe
      }, this.headers);
  }


  emptyCart() {
    this.cartCurrent = new Cart();
    this.emitCartSubject('empty');
  }

  // saveOrder()
  saveOrder(cartOrder: {}): Observable<any> {
    return this.http.post<any>(`${this.urlApi}order/save`,
      JSON.stringify(cartOrder), this.headers);
  }

  getCostDelivery(dataDistance: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}delivery/cost`,
      JSON.stringify(dataDistance), this.headers);
  }
  saveCodeCustomerToDeliver(responseCustomer): Observable<any> {
    return this.http.post<any>(`${this.urlApi}order/save/delivery-code`,
      responseCustomer, this.headers);
  }


  getStateRestaurant(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}business/state/${restaurantId}`, this.headers);
  }

  getProducts() {
    return this.cartCurrent.products;
  }

  getBusinessCurrent() {
    return this.cartCurrent.restaurant;
  }

  setTipDelivererAmount(tipAmount: number) {
    this.cartCurrent.tipDelivererAmount = tipAmount;
    this.generateTotalCart(true);
    this.emitCartSubject();
  }

  setPromotionalCode(promotionalCode: any) {
    console.warn('methid promo code', promotionalCode);
    console.warn('cartCurrent', [this.cartCurrent, this.cartCurrent.promotionalCode]);
    this.cartCurrent.promotionalCode = new Promotion();

    this.cartCurrent.promotionalCode = promotionalCode;
    console.warn('after init ', [this.cartCurrent, this.cartCurrent.promotionalCode]);

    this.generateTotalCart(true);
  }


  initCartPayment() {
    this.cartCurrent.tipDelivererAmount = 0.0;
    this.cartCurrent.promotionalCode = null;
  }


  hasPercentPromotionSubscription(): boolean {
    return this.user && this.user.data && this.user.data.subscription && this.user.data.subscription.percent && +this.user.data.subscription.percent > 0;
  }



  isFreeShippingCost(): boolean {
    return this.cartCurrent.subscription.isFreeShippingCost && (this.cartCurrent.distance && +this.cartCurrent.distance < this.limitDistance.DISTANCE_MAX);
  }

  setDistanceCart(distance: number) {
    this.cartCurrent.distance = distance;
    this.generateTotalCart();
    this.emitCartSubject();
  }

  getFastItFee(totalCount: number) {
    if (totalCount <= 7) {
      return 0.50;
    } else if (totalCount <= 10) {
      return 1.00;
    } else if (totalCount <= 15) {
      return 1.50;
    } else if (totalCount <= 20) {
      return 2.00;
    } else if (totalCount > 20) {
      return 2.50;
    }
  }
}
