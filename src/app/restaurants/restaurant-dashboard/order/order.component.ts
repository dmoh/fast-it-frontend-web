import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityRestaurantService} from "@app/_services/security-restaurant.service";
import {Restaurant} from "@app/_models/restaurant";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  restaurantDatas: any;
  restaurant: Restaurant;
  orders: any[];
  constructor(
    private restaurantService: RestaurantDashboardService,
    private securityRestaurantService: SecurityRestaurantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.securityRestaurantService.getRestaurant()
      .subscribe((res) => {
        console.log({restaurId: res});
      });

    /*this.restaurantService.getOrdersDatas(restaurantId).subscribe((res) => {
      this.restaurant = RestaurantDashboardComponent.extractRestaurantData('business', res);
      this.orders = RestaurantDashboardComponent.extractRestaurantData('order', res);
    });*/
  }
}
