import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {RestaurantDashboardComponent} from "@app/restaurants/restaurant-dashboard/restaurant-dashboard.component";
import {Restaurant} from "@app/_models/restaurant";
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  chart = [];
  orders: any[];
  opinions: any[];
  restaurant: Restaurant;
  countOrderCurrentMonth: string;
  amountOrderCurrentMonth: string;
  date: Date;
  dateDisplay: string;
  constructor(private restaurantService: RestaurantDashboardService) { }

  ngOnInit(): void {
    this.date = new Date();
    this.dateDisplay  = this.date.toLocaleString();
    this.restaurantService.getOrderAnalize(1)
      .subscribe((response) => {
        this.amountOrderCurrentMonth = ((response.amount).toFixed(2)).replace('.', ',');
        this.countOrderCurrentMonth = response.count;
        const ctx = document.getElementById('myChart');
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [response.month],
            datasets: [{
              label: 'Ventes par mois',
              data: [response.amount],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      });
    this.restaurantService.getOrdersDatas(1).subscribe((res) => {
      this.orders = RestaurantDashboardComponent.extractRestaurantData('order', res);
      this.restaurantService.getOpinionByBusinessId(1)
        .subscribe((re) => {
          this.opinions = re;
        });
    });

  }
}
