import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {Restaurant} from '@app/_models/restaurant';
import {SecurityRestaurantService} from '@app/_services/security-restaurant.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AdminService} from "@app/admin/admin.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  restId: number;
  dateDisplay: string;
  constructor(private restaurantService: RestaurantDashboardService,
              private securityRestaurantService: SecurityRestaurantService,
              private snackBar: MatSnackBar,
              private adminService: AdminService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.date = new Date();
    this.dateDisplay  = this.date.toLocaleString();
    if (localStorage.getItem('restaurant') != null) {
      this.restId = JSON.parse(localStorage.getItem('restaurant')).id;
      let isSameRestaurantId = true;
      const urlArray = this.router.url.split('/');
      urlArray.forEach((elem) => {
        if (/[0-9]/.test(elem.trim())) {
          if (this.restId !== +(elem.trim())) {
            isSameRestaurantId = false;
            this.restId = +(elem.trim());
            this.getRestaurant(this.restId);
            return;
          }
        }
      });
      setTimeout(() => {
        if (isSameRestaurantId === true) {
          this.getRestaurant(this.restId);
        }
      }, 10);
    } else {
      const urlArray = this.router.url.split('/');
      urlArray.forEach((elem) => {
        if (/[0-9]/.test(elem.trim())) {
          this.restId = +(elem.trim());
          this.getRestaurant(this.restId);
          return;
        }
      });
    }
  }

  private getRestaurant(restId: number) {
    this.securityRestaurantService.getRestaurant()
      .subscribe((restaurantData) => {
        this.restaurantService.getOrderAnalize(restId)
          .subscribe((response) => {
            this.amountOrderCurrentMonth = ((response.amount).toFixed(2)).replace('.', ',');
            this.countOrderCurrentMonth = response.count;
            this.restaurant = response.restaurant;
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
        this.restaurantService.getOrdersDatas(restId).subscribe((res) => {
          this.orders = RestaurantDashboardComponent.extractRestaurantData('order', res);
          this.restaurantService.getOpinionByBusinessId(restId)
            .subscribe((re) => {
              this.opinions = re;
            });
        });
      });
  }
  onChange(event, commerce) {
    this.adminService.changeCommerceState(this.restaurant.id, this.restaurant.closed)
      .subscribe((res) => {
        let info = `Le Restaurant est ouvert`;
        if (this.restaurant.closed === true) {
          info = `Le Restaurant est fermé`;
        }
        this.snackBar.open(info, 'OK', {
          duration: 5000
        });
      });
  }
}
