import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {Restaurant} from "@app/_models/restaurant";

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit {

  restaurants: Restaurant[];
  findRestaurant: string = '';
  arraySearchResturant: Restaurant[];
  allRestaurants: Restaurant[];
  newestRestaurants: Restaurant[];
  constructor(private router: Router,
              private restaurantService: RestaurantDashboardService
              ) { }

  ngOnInit(): void {
    this.restaurantService
      .getAllbusinesses()
      .subscribe((res) => {
        if (res.ok) {
          this.restaurants = res.restaurants;
          /*const sortNewestRestaurants = res.restaurants.sort((n1, n2) => n2.id - n1.id);
          this.newestRestaurants = sortNewestRestaurants.filter((elem, index) => {
            const forbiddenId = [63, 62];
            return index < 5 && forbiddenId.indexOf(+(elem.id)) === -1;
          });*/
          this.allRestaurants = res.restaurants;
        }
      });
  }

  goToRestaurantBy(id: number) {
    this.router.navigate([`/restaurant/${id}`]);
  }

  onSearchRestaurant(): void {
    if (this.findRestaurant.trim().length >= 2) {
      this.restaurants.forEach((elem) => {
        const regExp = new RegExp(`(\s*)(${ this.findRestaurant })+(\s*)`, 'i');
        if (regExp.test(elem.name)) {
          const index = this.restaurants
            .findIndex((restau) => +elem.id === +restau.id);
          if (index === -1) {
            this.restaurants = [elem, ...this.restaurants];
          }
        } else {
          this.restaurants = this.restaurants
            .filter((restau) => +restau.id !== +elem.id);
        }
      });
    } else if (this.findRestaurant.trim().length < 2) {
      this.restaurants = this.allRestaurants;
    }
  }



}
