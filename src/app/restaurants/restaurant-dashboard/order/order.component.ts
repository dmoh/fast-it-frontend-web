import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
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
          console.log(elem);
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
