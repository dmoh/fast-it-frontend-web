import {Component, OnInit, Optional} from '@angular/core';
import {Product} from "../models/product";
import {Cart} from "./model/cart";
import {CartService} from "./service/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {


  cart: Cart;
  @Optional() products: Product[];
  hasProduct: boolean;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartSub) => this.cart = cartSub);
    if (!this.products) {
      this.hasProduct = false;
    }
  }







}
