import { Component, OnInit } from '@angular/core';
import {Cart} from "../cart/model/cart";
import {CartService} from "../cart/service/cart.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  cart: Cart;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => this.cart = cartUpdated);
  }

}
