import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import {Cart} from "../cart/model/cart";
import {CartService} from "../cart/service/cart.service";
import {AuthenticationService} from "@app/_services/authentication.service";
import { User } from '@app/_models/user';
import { SidenavService } from '@app/sidenav-responsive/sidenav.service';
import { MediaQueryService } from '@app/_services/media-query.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // @Output() navToggle = new EventEmitter<boolean>();
  user: any;
  cart: Cart;
  isMediaMatches: boolean;

  constructor(
    private mediaQueryService: MediaQueryService,
    private authentication: AuthenticationService,
    private sidenavService: SidenavService,
    private cartService: CartService,
    ) { }
    
  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => this.cart = cartUpdated);
    this.user = !this.authentication.currentUserValue ? new User() : this.authentication.currentUserValue;
    this.onMediaChange(this.mediaQueryService.getMedia());
    this.mediaQueryService.getMedia().addEventListener("change", e => this.onMediaChange(e));
  }

  onMediaChange(e: any) {
    this.isMediaMatches = e.matches;
  }


  onToggleSideNav() {
    // this.navToggle.emit(true);
    this.sidenavService.toggle();
  }

  onLogout(){
    this.authentication.logout();
  }
}
