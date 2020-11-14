import { Component, OnInit } from '@angular/core';
import {Cart} from "../cart/model/cart";
import {CartService} from "../cart/service/cart.service";
import {AuthenticationService} from "@app/_services/authentication.service";
import { User } from '@app/_models/user';

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
    this.authentication.currentUser.subscribe((res) => {
      this.user = !res ? new User() : res;
    });
    this.authentication.currentAdmin
      .subscribe((res) => {
        console.log(res);
      });
    // this.user = !this.authentication.currentUserValue ? new User() : this.authentication.currentUserValue;
  }

  onLogout(){
    this.authentication.logout();
  }
}
