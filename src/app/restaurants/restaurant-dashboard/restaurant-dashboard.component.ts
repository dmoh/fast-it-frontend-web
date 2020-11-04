import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from "@app/_models/restaurant";
import {ActivatedRoute} from "@angular/router";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OrderModalComponent} from "@app/restaurants/order-modal/order-modal.component";

@Component({
  selector: 'app-restaurant-dashboard',
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.scss']
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantDatas: any;
  restaurant: Restaurant;
  products: any[];
  constructor(
    private restaurantService: RestaurantDashboardService,
    private activatedRoute: ActivatedRoute,
    private modal: NgbModal
  ) { }

  static extractRestaurantData(typeData: string, arrayBusinessDatas: any[]) {
    const arrRestaurant =  arrayBusinessDatas.filter((elem) => {
      return elem[typeData];
    });
    switch (typeData) {
      case 'business':
        if (typeof arrRestaurant[0].product !== 'undefined') {
          if (typeof arrRestaurant[0].product.medias !== 'undefined' ) {
            arrRestaurant[0].business.medias = arrRestaurant[0].product.medias;
          }

          if (typeof arrRestaurant[0].product.opinions !== 'undefined' ) {
            arrRestaurant[0].business.opinions = arrRestaurant[0].product.opinions;
          }
        }
        console.log(arrRestaurant[0].business);
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
      .queryParams
      .subscribe((params) => {
        console.log();
         if (params.products && params.orderId) {
           const modalRef = this.modal.open(OrderModalComponent, {
             backdrop: 'static',
             keyboard: false,
             size: 'lg'
           });
         }
      });

    this.restaurantService.getRestaurantDatas(1).subscribe((res) => {
      this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
      this.products = RestaurantDashboardComponent.extractRestaurantData('product', res);
      console.warn(this.products);
    } );
  }




}
