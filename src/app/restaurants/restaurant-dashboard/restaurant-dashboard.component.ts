import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from '@app/_models/restaurant';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrderModalComponent} from '@app/restaurants/order-modal/order-modal.component';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';

@Component({
  selector: 'app-restaurant-dashboard',
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.scss']
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantDatas: any;
  restaurant: Restaurant;
  products: any[];
  restaurantId: number;
  constructor(
    private restaurantService: RestaurantDashboardService,
    private securityRestaurantService: SecurityRestaurantService,
    private activatedRoute: ActivatedRoute,
    private modal: NgbModal,
    private router: Router
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
    this.activatedRoute
      .queryParams.subscribe((res) => {
       if (res.orderId) {
         this.restaurantService.getOrderById(res.orderId)
           .subscribe((order) => {
             const modalRef = this.modal.open(OrderModalComponent, {
               backdrop: 'static',
               keyboard: false,
               size: 'lg'
             });
           });
       }
    });
    this.activatedRoute
      .queryParams
      .subscribe((params) => {
         if (params.products && params.orderId) {

         }
      });
    this.activatedRoute.params.subscribe((params) => {
      this.restaurantId = +(params.id);
      this.securityRestaurantService.setRestaurant({id: this.restaurantId});
      this.restaurantService.getRestaurantDatas(this.restaurantId).subscribe((res) => {
        this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
        if (this.restaurant === null) {
          this.restaurantService.getRestaurantInfosById(this.restaurantId)
            .subscribe((restaurantDb) => {
              this.restaurant = restaurantDb.restaurant;
            });
        }
        this.products = RestaurantDashboardComponent.extractRestaurantData('product', res);
      } );
    });

  }
}
