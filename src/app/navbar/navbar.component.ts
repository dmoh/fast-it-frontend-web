import { Component, OnDestroy, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import {Cart} from '../cart/model/cart';
import {CartService} from '../cart/service/cart.service';
import {AuthenticationService} from '@app/_services/authentication.service';
import { User } from '@app/_models/user';
import { MediaQueryService } from '@app/_services/media-query.service';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SidenavService } from '@app/sidenav-responsive/sidenav.service';
import {AdminService} from '@app/admin/admin.service';
import {InfoModalComponent} from "@app/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { Location } from '@angular/common';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any;
  cart: Cart;
  isMedia: boolean;
  isAdmin: boolean;
  isArtist: boolean;
  isDeliverer: boolean;
  isSuper: boolean;
  showMenu: boolean;
  modeSide: string;
  showBackButton: boolean;
  alertMessage: string;
  classAlertMessage: string;
  constructor(
    private mediaQueryService: MediaQueryService,
    private authentication: AuthenticationService,
    private sidenavService: SidenavService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private restaurantDashboardService: RestaurantDashboardService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private infoModal: NgbModal,
    private location: Location
  ) {
    this.router.events.subscribe((data) => {
      this.showBackButton = !/(^\/home$)|(^\/$)/i.test(this.location.path());
    })
  }


  ngOnInit(): void {
    this.modeSide = 'side';
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => this.cart = cartUpdated);
    this.authentication.currentUser.subscribe((res) => {
      this.user = !res ? new User() : res;
    });

    /*this.adminService
      .getAlertMessage()
      .subscribe((res) => {
        if (res.ok) {
          this.alertMessage = res.alertMessage;
          this.classAlertMessage = res.classAlertMessage;
        }
      });*/
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
          if (res.indexOf('ROLE_ARTIST') > -1) {
            this.isArtist = true;
          }
        }
      });

    this.router.events.subscribe((res) => {
      const url =  /(restaurant-dashboard|admin|delivery|customer)/i;
      // @ts-ignore
      if (typeof res.url !== 'undefined') {
        // @ts-ignore
        if (res.url.match(url)) {
          this.showMenu = true;
          this.isMedia = this.mediaQueryService.getMobile();
        } else {
          this.showMenu = false;
          this.isMedia = false;
        }
      }
    });
  }

  onToggleSideNav() {
    // lesten subscribe into sideNavToggleSubject
    this.sidenavService.toggle();
  }

  onLogout(){
    this.cartService.emptyCart();
    this.authentication.logout();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url} });
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


  @HostListener('window:resize', [])
  onResize() {
    if (this.showMenu === true) {
      this.isMedia = this.mediaQueryService.getMobile();
      this.modeSide = 'over';
    }
    if (!this.isMedia){
      this.modeSide = 'side';
      this.sidenavService.close();
    }
  }

  onOpenModal() {
    const modalRef = this.infoModal.open(InfoModalComponent);
    modalRef.componentInstance.title = 'Modalités pour participer au concours PS5';
    modalRef.componentInstance.infoCompetition = true;
  }

  back(): void {
    this.location.back()
  }
}
