import {Component, HostListener, Input, OnInit, Optional} from '@angular/core';
import {Router} from "@angular/router";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {Restaurant} from "@app/_models/restaurant";
import {CityDataService} from "@app/city-data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryBusiness} from "@app/_models/category-business";
import {CategoryRestaurantService} from "@app/_services/category-restaurant.service";
import {timer} from "rxjs";

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
  showAll: boolean;
  onlyAreaRestaurants: boolean;
  categorySelected: CategoryBusiness;
  constructor(private router: Router,
              private restaurantService: RestaurantDashboardService,
              private cityDatas: CityDataService,
              private snackBar: MatSnackBar,
              private categoryRestaurantService: CategoryRestaurantService
              ) { }

  ngOnInit(): void {
    this.restaurantService
      .getAllbusinesses()
      .subscribe((res) => {
        if (res.ok) {
          const source = timer(2500);
          const subscribe = source.subscribe(val => {
            this.getCurrentCategory();
            this.restaurants = res.restaurants;
            this.allRestaurants = res.restaurants;
            this.cityDatas
              .getCityData()
              .subscribe((locationDatas) => {
                this.restaurants = this.allRestaurants;
                this.restaurants = this.restaurants.filter((resto) => {
                  return resto.zipcode === locationDatas.zipCode
                    || resto.city.toLowerCase() === locationDatas.city.toLowerCase();
                });
                this.onlyAreaRestaurants = true;
                if (this.restaurants.length === 0 ){
                  this.onlyAreaRestaurants = false;
                  this.restaurants = this.allRestaurants;
                  this.snackBar.open(
                    'Aucun restaurant dans cette ville. Néanmoins il est possible de vous livrer où que vous soyez.* :)', 'ok', {
                      duration: 7000,
                      verticalPosition: 'top',
                      horizontalPosition: 'center'
                    });
                }
              });
          });
          setTimeout(() => {
            subscribe.unsubscribe();
          }, 20000);
        }
      });
  }

  goToRestaurantBy(id: number) {
    this.router.navigate([`/restaurant/${id}`]);
  }

  private getCurrentCategory() {
    this.categoryRestaurantService.getCategoryRestaurant()
      .subscribe((category) => {
        if (category.id && +category.id > 0) {
          this.categorySelected = category;
        }
      });
  }
  onShowAllRestaurants() {
    this.restaurants = this.allRestaurants;
    this.onlyAreaRestaurants = false;
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.warn(event.target.innerWidth);
  }

}
