import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RestaurantDashboardService} from "@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service";
import {Restaurant} from "@app/_models/restaurant";
import {CityDataService} from "@app/city-data.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  constructor(private router: Router,
              private restaurantService: RestaurantDashboardService,
              private cityDatas: CityDataService,
              private snackBar: MatSnackBar
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
        }
      });
  }

  goToRestaurantBy(id: number) {
    this.router.navigate([`/restaurant/${id}`]);
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
