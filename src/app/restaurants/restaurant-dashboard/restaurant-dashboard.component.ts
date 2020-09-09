import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';

@Component({
  selector: 'app-restaurant-dashboard',
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.scss']
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantDatas: any;
  restaurant: any;
  products: any[];
  constructor(private restaurantService: RestaurantDashboardService) { }

  static extractRestaurantData(typeData: string, arrayBusinessDatas: any[]) {
    const arrRestaurant =  arrayBusinessDatas.filter((elem) => {
      return elem[typeData];
    });
    switch (typeData) {
      case 'business':
        return arrRestaurant.length === 1 ? arrRestaurant[0].business : null;
      case 'product':
      return arrRestaurant.filter(elem => {
        return elem[typeData];
      });
      case 'order':
        return arrRestaurant.filter(elem => {
          return elem[typeData];
        });
    }
  }
  ngOnInit(): void {
    this.restaurantService.getRestaurantDatas(1).subscribe((res) => {
      this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
      this.products = RestaurantDashboardComponent.extractRestaurantData('product', res);
      console.warn(this.products);
    } );
  }




}
