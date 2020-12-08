import { Component, OnInit } from '@angular/core';
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {SecurityRestaurantService} from "@app/_services/security-restaurant.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  period: string = '11/2020';
  restaurantId: number;
  constructor(
    private restaurantDashboardService: RestaurantDashboardService,
    private securityRestaurantService: SecurityRestaurantService
  ) { }

  ngOnInit(): void {
    this.securityRestaurantService.getRestaurant()
      .subscribe((res) => {
        this.restaurantId = res.id;
      });
  }

  onExtractPeriod(){
    this.restaurantDashboardService
      .getStatsByRestaurantId(this.restaurantId, this.period)
      .subscribe((response) => {
        console.warn(response);
      });
  }

}
