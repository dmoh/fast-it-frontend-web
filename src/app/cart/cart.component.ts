import {Component, OnInit, Optional} from '@angular/core';
import {Product} from '../models/product';
import {Cart} from './model/cart';
import {CartService} from './service/cart.service';
import { Router} from '@angular/router';
import {AuthenticationService} from "@app/_services/authentication.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  qMax: number[];
  cart: Cart;
  @Optional() products: Product[];
  user;
  hasProduct: boolean;
  hasPercentPromotionSubscription: boolean = false;
  percentPromotionSubscription: number;
  subName: string = '';
  constructor(private cartService: CartService,
              private route: Router,
              private authentication: AuthenticationService
  ) { }

  ngOnInit(): void {

    this.authentication
        .currentUser
        .subscribe((user) => {
          this.user = user;
          if (this.user
              && this.user.data
              && this.user.data.subscription
              && this.user.data.subscription.percent
              && +this.user.data.subscription.percent > 0
          ) {
            this.hasPercentPromotionSubscription = true;
            this.percentPromotionSubscription = this.user.data.subscription.percent;
            this.subName = this.user.data.subscription.title;
          }
        })
    ;
    this.cartService.cartUpdated.subscribe((cartSub) => this.cart = cartSub);
    if (!this.products) {
      this.hasProduct = false;
    }

    this.qMax = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  onUpdateCart(event, product: Product): void {
    product.quantity = +(event.target.value);
    this.cartService.UpdateCart('update', product);
  }

  onDelete(product: Product, indexProduct: number) {
    if (this.cart.products.length <= 1) {
      this.cartService.emptyCart();
    } else {
      this.cartService.UpdateCart('remove', product);
    }
  }
  seeCart(): void {
    this.route.navigate(['cart-detail']);
  }

  onEmptyCart() {
    this.cartService.emptyCart();
  }
}
