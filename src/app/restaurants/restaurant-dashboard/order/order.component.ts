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
  orders: any[];
  constructor(private restaurantService: RestaurantDashboardService) { }

  ngOnInit(): void {
    this.restaurantService.getOrdersDatas(1).subscribe((res) => {
      this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
      this.orders = RestaurantDashboardComponent.extractRestaurantData('order', res);
      console.warn(this.orders);
    } );
  }

}
