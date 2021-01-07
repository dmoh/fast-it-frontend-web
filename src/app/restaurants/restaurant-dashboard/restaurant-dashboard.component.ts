import {AfterViewInit, Component, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from '@app/_models/restaurant';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '@app/sidenav-responsive/sidenav.service';
import { MediaQueryService } from '@app/_services/media-query.service';
import {AuthenticationService} from "@app/_services/authentication.service";

@Component({
  selector: 'app-restaurant-dashboard',
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.scss']
})
export class RestaurantDashboardComponent implements OnInit, AfterViewInit {
  restaurantDatas: any;
  restaurant: Restaurant;
  products: any[];
  restaurantId: number;
  modeSide: string;
  isMedia: boolean;

  @ViewChild('sidebarLeft')
  public sidenav: MatSidenav;
  @Output() sidenavChange = new EventEmitter<MatSidenav>();

  constructor(
    private restaurantService: RestaurantDashboardService,
    private securityRestaurantService: SecurityRestaurantService,
    private activatedRoute: ActivatedRoute,
    private modal: NgbModal,
    private mediaQueryService: MediaQueryService,
    private sidenavService: SidenavService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  static extractRestaurantData(typeData: string, arrayBusinessDatas: any[]) {
    const arrRestaurant =  arrayBusinessDatas.filter((elem) => {
      return elem[typeData];
    });
    switch (typeData) {
      case 'business':
        if (arrRestaurant.length > 0) {
          if (typeof arrRestaurant[0].product !== 'undefined') {
            if (typeof arrRestaurant[0].product.medias !== 'undefined' ) {
              arrRestaurant[0].business.medias = arrRestaurant[0].product.medias;
            }

            if (typeof arrRestaurant[0].product.opinions !== 'undefined' ) {
              arrRestaurant[0].business.opinions = arrRestaurant[0].product.opinions;
            }
          }
        }
        return arrRestaurant.length >= 1 ? arrRestaurant[0].business : null;
      case 'product':
      return arrRestaurant.filter(elem => {
        return typeof elem.product.tags === 'undefined' ? elem.product : '';
      });
      case 'order':
        return arrRestaurant.filter(elem => {
          return elem[typeData];
        });
    }
  }
  ngOnInit(): void {
    if (window.innerWidth > 992) {
      this.modeSide = 'side';
    } else {
      this.modeSide = 'over';
    }
    if  (localStorage.getItem('restaurant') != null) {
      this.restaurantId = +(JSON.parse(localStorage.getItem('restaurant')).id);
      this.authenticationService.checkIsManager(this.restaurantId)
        .subscribe((response) => {
          if (response.error) {
            this.router.navigate(['/home']);
            return false;
          } else {
            this.securityRestaurantService.setRestaurant({id: this.restaurantId});
            this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', response);
            if (this.restaurant === null) {
              this.restaurantService.getRestaurantInfosById(this.restaurantId)
                .subscribe((restaurantDb) => {
                  this.restaurant = restaurantDb.restaurant;
                });
            }
            this.products = RestaurantDashboardComponent.extractRestaurantData('product', response);
          }
        });
    } else {
      this.activatedRoute.params.subscribe((params) => {
        this.restaurantId = +(params.id);
        const resId = +(params.id);
        this.authenticationService.checkIsManager(this.restaurantId)
          .subscribe((response) => {
            if (response.error) {
              this.router.navigate(['/home']);
              return false;
            } else {
              this.securityRestaurantService.setRestaurant({id: resId});
              this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', response);
              if (this.restaurant === null) {
                this.restaurantService.getRestaurantInfosById(resId)
                  .subscribe((restaurantDb) => {
                    this.restaurant = restaurantDb.restaurant;
                  });
              }
              this.products = RestaurantDashboardComponent.extractRestaurantData('product', response);
            }
          });
      });

    }

    this.isMedia = this.mediaQueryService.getMobile();
}

@HostListener('window:resize', [])
onResize() {
  this.isMedia = this.mediaQueryService.getMobile();
  if (!this.isMedia) {
    this.sidenav.open();
    this.modeSide = 'side';
  }
  if (this.isMedia) {
    this.modeSide = 'over';
    this.sidenav.close();
  }
}


  ngAfterViewInit() {
    this.sidenavService.sideNavToggleSubject.subscribe(()=> {
       return this.sidenav.toggle();
     });
  }

}
