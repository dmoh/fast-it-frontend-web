import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import {Cart} from "../cart/model/cart";
import {CartService} from "../cart/service/cart.service";
import {AuthenticationService} from "@app/_services/authentication.service";
import { User } from '@app/_models/user';
import { SidenavService } from '@app/sidenav-responsive/sidenav.service';
import { MediaQueryService } from '@app/_services/media-query.service';
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  isAdmin: boolean;
  isDeliverer: boolean;
  isSuper: boolean;
  constructor(
    private mediaQueryService: MediaQueryService,
    private authentication: AuthenticationService,
    private sidenavService: SidenavService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private restaurantDashboardService: RestaurantDashboardService,
    private router: Router
  ) { }

  onMediaChange(e: any) {
    this.isMediaMatches = e.matches;
  }


  onToggleSideNav() {
    // this.navToggle.emit(true);
    this.sidenavService.toggle();
  }

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => this.cart = cartUpdated);
    this.authentication.currentUser.subscribe((res) => {
      this.user = !res ? new User() : res;
    });
    this.authentication.currentRoles
      .subscribe((res) => {
        if (res !== null) {
          if (res.indexOf('ROLE_ADMIN') > -1) {
            this.isAdmin = true;
          }
          if (res.indexOf('ROLE_SUPER_ADMIN') > -1) {
            this.isSuper = true;
          }
          if (res.indexOf('ROLE_DELIVERER') > -1) {
            this.isDeliverer = true;
          }
        }
      });
      this.onMediaChange(this.mediaQueryService.getMedia());
      this.mediaQueryService.getMedia().addEventListener("change", e => this.onMediaChange(e));
      this.onToggleSideNav(); 
      // this.user = !this.authentication.currentUserValue ? new User() : this.authentication.currentUserValue;
  }

  onLogout(){
    this.authentication.logout();
  }

  goTo() {
    this.restaurantDashboardService.getUrlRestaurant()
      .subscribe((response) => {
        if (response.error) {
          this.snackBar.open(response.error, 'OK', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        } else {
          this.router.navigate([`restaurant-dashboard/${response.restaurantId}/overview`]);
        }
      });
  }
}
