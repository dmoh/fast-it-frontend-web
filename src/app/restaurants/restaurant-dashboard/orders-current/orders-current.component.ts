import { Component, OnInit } from '@angular/core';
import {Order} from "@app/_models/order";
import {SecurityRestaurantService} from "@app/_services/security-restaurant.service";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";

@Component({
  selector: 'app-orders-current',
  templateUrl: './orders-current.component.html',
  styleUrls: ['./orders-current.component.scss']
})
export class OrdersCurrentComponent implements OnInit {
  orders: Order[];
  orderList: any[] = [];
  constructor(
    private securityRestaurantService: SecurityRestaurantService,
    private restaurantService: RestaurantDashboardService
    ) { }

  ngOnInit(): void {
    this.securityRestaurantService.getRestaurant()
      .subscribe((res) => {
        this.restaurantService.getOrdersCurrentDatas(res.id)
          .subscribe((response) => {
            response.forEach((data) => {
               if (data[0]) {
                 this.orderList = [...this.orderList, data[0]];
                 console.log(this.orderList);
               }
            });
            this.orderList = response;
            console.warn(this.orderList);
            /*return;
            this.orders = [];
            response.forEach((elem) => {
              if (elem.order) {
                this.orders = [...this.orders, elem.order];
              }
            });*/
          });
      });
  }

}
