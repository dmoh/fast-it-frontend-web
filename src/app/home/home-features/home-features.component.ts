import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RestaurantDashboardService} from '@app/restaurants/restaurant-dashboard/services/restaurant-dashboard.service';
import {Restaurant} from '@app/_models/restaurant';
import {CityDataService} from '@app/city-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryBusiness} from '@app/_models/category-business';
import {CategoryRestaurantService} from '@app/_services/category-restaurant.service';
import {Observable, Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit, OnDestroy {

  restaurants: Restaurant[];
  findRestaurant: string = '';
  arraySearchResturant: Restaurant[];
  allRestaurants: Restaurant[];
  newestRestaurants: Restaurant[];
  showAll: boolean;
  onlyAreaRestaurants: boolean;
  categorySelected: CategoryBusiness;
  eventSubscription: Subscription;
  @Input() renewYourPart: Observable<void>;
  private isFirstTime: boolean = true;
  reloadPage: boolean;
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
          this.isFirstTime = true;
          const source = timer(2000);
          const subscribe = source.subscribe(val => {
            this.getCurrentCategory();
            this.restaurants = res.restaurants;
            this.allRestaurants = res.restaurants;
            this.cityDatas
              .getCityData()
              .subscribe((locationDatas) => {
                if (!locationDatas.city && !locationDatas.zipCode) {
                  return;
                }
                this.restaurants = this.allRestaurants;
                this.restaurants = this.restaurants.filter((resto) => {
                  return resto.zipcode === locationDatas.zipCode
                    || resto.city.toLowerCase() === locationDatas.city.toLowerCase();
                });
                this.onlyAreaRestaurants = true;
                if (this.restaurants.length === 0 ){
                  this.onlyAreaRestaurants = false;
                  this.restaurants = this.restaurants.filter((resto) => {
                    return resto.zipcode.substr(0, 2) === locationDatas.zipCode.substr(0, 2)
                    || resto.city.toLowerCase().trim() === locationDatas.city.toLowerCase().trim()
                    ;
                  });
                  if (this.restaurants.length === 0) {
                    /**/setTimeout(() => {
                      this.snackBar.open(
                        'Aucun restaurant dans cette ville, pour le moment. Vous pouvez néanmoins commander dans d\'autre(s) restaurant(s)', 'ok', {
                          duration: 10000,
                          verticalPosition: 'top',
                          horizontalPosition: 'center'
                        });
                    }, 100);
                    this.restaurants = this.allRestaurants;

                  }
                }
              });
          });
          setTimeout(() => {
            subscribe.unsubscribe();
          }, 20000);
        }
      });

    this.eventSubscription = this.renewYourPart.subscribe((val) => {
      if(!this.isFirstTime) {
        this.ngOnInit();
      }
    });

  }

  goToRestaurantBy(id: number) {
    this.router.navigate([`/restaurant/${id}`]);
  }


  ngOnDestroy() {
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
  }

}
