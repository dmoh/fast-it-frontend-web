import { Component, OnInit } from '@angular/core';
import {Cart} from "../cart/model/cart";
import {CartService} from "../cart/service/cart.service";
import {AuthenticationService} from "@app/_services/authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any;
  cart: Cart;
  constructor(
    private cartService: CartService,
    private authentication: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => this.cart = cartUpdated);
    this.user = this.authentication.currentUserValue;
  }

}
